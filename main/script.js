// Theme Management
const Theme = {
    current: 'dark',
    
    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.set(savedTheme);
    },
    
    set(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.current = theme;
        this.updateIcon();
    },
    
    toggle() {
        this.set(this.current === 'dark' ? 'light' : 'dark');
    },
    
    updateIcon() {
        const icon = document.getElementById('theme-icon');
        icon.innerHTML = this.current === 'light'
            ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
            : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    }
};

// Notification System
const Notifications = {
    requestPermission() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    },
    
    show(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: body });
        }
    }
};

// Auth Management
const Auth = {
    async login(email, password) {
        try {
            const submitBtn = document.querySelector('#login-form button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;
            
            await window.__TAURI__.invoke('send_notification', { title: 'Auth Attempt', body: 'Login attempt for: ' + email });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            localStorage.setItem('deepseek_email', email);
            
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('chat-interface').classList.remove('hidden');
            document.getElementById('chat-interface').classList.add('active');
            
            Notifications.show('Welcome Back!', 'You are now logged in');
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            alert('Authentication failed');
            return false;
        }
    },
    
    logout() {
        localStorage.removeItem('deepseek_email');
        localStorage.removeItem('chat_history');
        
        document.getElementById('chat-interface').classList.remove('active');
        document.getElementById('chat-interface').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('login-screen').classList.add('active');
        
        Notifications.show('Logged Out', 'You have been logged out');
    },
    
    isLoggedIn() {
        return localStorage.getItem('deepseek_email') !== null;
    }
};

// Chat System
const Chat = {
    messages: [],
    
    init() {
        this.loadHistory();
        this.setupEventListeners();
    },
    
    loadHistory() {
        const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
        this.messages = history;
        
        const container = document.getElementById('chat-container');
        const welcome = container.querySelector('.welcome-message');
        
        if (this.messages.length > 0 && welcome) {
            welcome.remove();
        }
        
        this.messages.forEach(msg => this.addMessageToUI(msg.role, msg.content));
    },
    
    saveHistory() {
        localStorage.setItem('chat_history', JSON.stringify(this.messages));
    },
    
    addMessage(role, content) {
        const message = { role: role, content: content, timestamp: Date.now() };
        this.messages.push(message);
        this.saveHistory();
        this.addMessageToUI(role, content);
    },
    
    addMessageToUI(role, content) {
        const container = document.getElementById('chat-container');
        const welcome = container.querySelector('.welcome-message');
        
        if (welcome) { welcome.remove(); }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + role;
        messageDiv.innerHTML = '<div class="message-content">' + this.escapeHtml(content) + '</div><div class="message-time">' + new Date().toLocaleTimeString() + '</div>';
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    setupEventListeners() {
        document.getElementById('chat-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('user-input');
            const content = input.value.trim();
            
            if (!content) return;
            
            this.addMessage('user', content);
            input.value = '';
            input.style.height = 'auto';
            
            this.simulateResponse(content);
        });
        
        document.getElementById('user-input')?.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
    },
    
    async simulateResponse(userMessage) {
        const container = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        messageDiv.innerHTML = '<div class="message-content">...</div>';
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = "I received: " + userMessage;
        messageDiv.querySelector('.message-content').textContent = response;
        
        this.addMessage('assistant', response);
        Notifications.show('New Response', 'DeepSeek has replied');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Notifications.requestPermission();
    Chat.init();
    
    if (Auth.isLoggedIn()) {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('chat-interface').classList.remove('hidden');
        document.getElementById('chat-interface').classList.add('active');
    }
    
    document.getElementById('theme-toggle')?.addEventListener('click', () => Theme.toggle());
    document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Auth.login(document.getElementById('email').value, document.getElementById('password').value);
    });
});