class AddressBook {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.contacts = [];
        this.currentFilter = 'all';
        this.editingContactId = null;

        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadContacts();
    }

    bindEvents() {
        // 添加联系人按钮
        document.getElementById('addContactBtn').addEventListener('click', () => {
            this.showModal();
        });

        // 关闭模态框
        document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // 点击模态框外部关闭
        document.getElementById('contactModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('contactModal')) {
                this.hideModal();
            }
        });

        // 表单提交
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });

        // 搜索功能
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterContacts(e.target.value);
        });

        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderContacts();
            });
        });

        // 添加联系方式按钮
        document.getElementById('addMethodBtn').addEventListener('click', () => {
            this.addContactMethod();
        });

        // 导出按钮
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportContacts();
        });

        // 导入文件选择
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importContacts(e.target.files[0]);
        });
    }

    async loadContacts() {
        try {
            const response = await fetch(`${this.baseUrl}/contacts`);
            this.contacts = await response.json();
            this.renderContacts();
        } catch (error) {
            console.error('加载联系人失败:', error);
            this.showNotification('加载联系人失败', 'error');
        }
    }

    renderContacts() {
        const container = document.getElementById('contactsContainer');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        let filteredContacts = this.contacts;

        // 应用搜索过滤
        if (searchTerm) {
            filteredContacts = filteredContacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.company?.toLowerCase().includes(searchTerm) ||
                contact.position?.toLowerCase().includes(searchTerm)
            );
        }

        // 应用筛选器
        if (this.currentFilter === 'favorite') {
            filteredContacts = filteredContacts.filter(contact => contact.is_favorite);
        }

        container.innerHTML = filteredContacts.map(contact => this.createContactCard(contact)).join('');

        // 绑定卡片上的事件
        this.bindContactCardEvents();
    }

    createContactCard(contact) {
        const favoriteClass = contact.is_favorite ? 'active' : '';
        const favoriteIcon = contact.is_favorite ? 'fas' : 'far';

        let contactMethods = '';
        if (contact.contact_methods && contact.contact_methods.length > 0) {
            contactMethods = contact.contact_methods.map(method => {
                const iconMap = {
                    phone: 'fas fa-phone',
                    email: 'fas fa-envelope',
                    wechat: 'fab fa-weixin',
                    address: 'fas fa-map-marker-alt'
                };
                return `
                    <div class="info-item">
                        <i class="${iconMap[method.type] || 'fas fa-info-circle'}"></i>
                        <span>${method.value}</span>
                    </div>
                `;
            }).join('');
        }

        return `
            <div class="contact-card ${contact.is_favorite ? 'favorite' : ''}" data-id="${contact.id}">
                <div class="contact-header">
                    <div class="contact-name">${contact.name}</div>
                    <button class="favorite-btn ${favoriteClass}" data-id="${contact.id}">
                        <i class="${favoriteIcon} fa-star"></i>
                    </button>
                </div>
                
                ${contact.company || contact.position ? `
                <div class="contact-info">
                    <div class="info-item">
                        <i class="fas fa-briefcase"></i>
                        <span>${contact.company || ''} ${contact.position ? `· ${contact.position}` : ''}</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="contact-info">
                    ${contactMethods}
                </div>
                
                ${contact.notes ? `
                <div class="contact-info">
                    <div class="info-item">
                        <i class="fas fa-sticky-note"></i>
                        <span>${contact.notes}</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="contact-actions">
                    <button class="btn-icon btn-edit" data-id="${contact.id}">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn-icon btn-delete" data-id="${contact.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    }

    bindContactCardEvents() {
        // 收藏按钮
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const contactId = parseInt(btn.dataset.id);
                await this.toggleFavorite(contactId);
            });
        });

        // 编辑按钮
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const contactId = parseInt(btn.dataset.id);
                this.editContact(contactId);
            });
        });

        // 删除按钮
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const contactId = parseInt(btn.dataset.id);
                if (confirm('确定要删除这个联系人吗？')) {
                    await this.deleteContact(contactId);
                }
            });
        });
    }

    showModal(contact = null) {
        this.editingContactId = contact ? contact.id : null;
        const modal = document.getElementById('contactModal');
        const title = document.getElementById('modalTitle');

        if (contact) {
            title.textContent = '编辑联系人';
            this.fillForm(contact);
        } else {
            title.textContent = '添加新联系人';
            document.getElementById('contactForm').reset();
            // 重置联系方式部分
            const contactMethods = document.getElementById('contactMethods');
            contactMethods.innerHTML = this.createContactMethodInput();
        }

        modal.classList.add('active');
    }

    hideModal() {
        document.getElementById('contactModal').classList.remove('active');
        document.getElementById('contactForm').reset();
        this.editingContactId = null;
    }

    fillForm(contact) {
        document.getElementById('name').value = contact.name || '';
        document.getElementById('company').value = contact.company || '';
        document.getElementById('position').value = contact.position || '';
        document.getElementById('notes').value = contact.notes || '';
        document.getElementById('isFavorite').checked = contact.is_favorite || false;

        // 填充联系方式
        const contactMethods = document.getElementById('contactMethods');
        contactMethods.innerHTML = '';

        if (contact.contact_methods && contact.contact_methods.length > 0) {
            contact.contact_methods.forEach((method, index) => {
                const methodInput = this.createContactMethodInput(method.type, method.value);
                contactMethods.innerHTML += methodInput;
            });
        } else {
            contactMethods.innerHTML = this.createContactMethodInput();
        }
    }

    createContactMethodInput(type = 'phone', value = '') {
        const showRemoveBtn = value ? '' : 'style="display: none;"';
        return `
            <div class="contact-method">
                <select class="method-type">
                    <option value="phone" ${type === 'phone' ? 'selected' : ''}>电话</option>
                    <option value="email" ${type === 'email' ? 'selected' : ''}>邮箱</option>
                    <option value="wechat" ${type === 'wechat' ? 'selected' : ''}>微信</option>
                    <option value="address" ${type === 'address' ? 'selected' : ''}>地址</option>
                </select>
                <input type="text" class="method-value" value="${value}" placeholder="联系方式">
                <button type="button" class="remove-method-btn" ${showRemoveBtn}>
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    addContactMethod() {
        const container = document.getElementById('contactMethods');
        const methodInput = this.createContactMethodInput();
        container.insertAdjacentHTML('beforeend', methodInput);

        // 绑定新添加的删除按钮事件
        const lastMethod = container.lastElementChild;
        const removeBtn = lastMethod.querySelector('.remove-method-btn');
        removeBtn.addEventListener('click', () => {
            lastMethod.remove();
        });
    }

    async saveContact() {
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);

        // 收集联系方式
        const contactMethods = [];
        document.querySelectorAll('.contact-method').forEach(methodEl => {
            const type = methodEl.querySelector('.method-type').value;
            const value = methodEl.querySelector('.method-value').value.trim();
            if (value) {
                contactMethods.push({ type, value });
            }
        });

        const contactData = {
            name: formData.get('name'),
            company: formData.get('company'),
            position: formData.get('position'),
            notes: formData.get('notes'),
            is_favorite: document.getElementById('isFavorite').checked,
            contact_methods: contactMethods
        };

        try {
            let response;

            if (this.editingContactId) {
                // 更新联系人
                response = await fetch(`${this.baseUrl}/contacts/${this.editingContactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
            } else {
                // 添加联系人
                response = await fetch(`${this.baseUrl}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
            }

            if (response.ok) {
                this.showNotification(
                    this.editingContactId ? '联系人已更新' : '联系人已添加',
                    'success'
                );
                this.hideModal();
                await this.loadContacts();
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            console.error('保存联系人失败:', error);
            this.showNotification('保存失败', 'error');
        }
    }

    async editContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
            this.showModal(contact);
        }
    }

    async toggleFavorite(contactId) {
        try {
            const response = await fetch(`${this.baseUrl}/contacts/${contactId}/favorite`, {
                method: 'PUT'
            });

            if (response.ok) {
                await this.loadContacts();
            }
        } catch (error) {
            console.error('切换收藏状态失败:', error);
            this.showNotification('操作失败', 'error');
        }
    }

    async deleteContact(contactId) {
        try {
            const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showNotification('联系人已删除', 'success');
                await this.loadContacts();
            }
        } catch (error) {
            console.error('删除联系人失败:', error);
            this.showNotification('删除失败', 'error');
        }
    }

    filterContacts(searchTerm) {
        this.renderContacts();
    }

    async exportContacts() {
        try {
            const response = await fetch(`${this.baseUrl}/export`);
            const blob = await response.blob();

            // 创建下载链接
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contacts_export.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showNotification('导出成功', 'success');
        } catch (error) {
            console.error('导出失败:', error);
            this.showNotification('导出失败', 'error');
        }
    }

    async importContacts(file) {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseUrl}/import`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.showNotification(result.message, 'success');
                await this.loadContacts();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('导入失败:', error);
            this.showNotification(`导入失败: ${error.message}`, 'error');
        }

        // 重置文件输入
        document.getElementById('importFile').value = '';
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // 自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new AddressBook();
});