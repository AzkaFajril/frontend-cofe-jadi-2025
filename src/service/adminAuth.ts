class AdminAuth {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_ROLE_KEY = 'userRole';

  isAdmin(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userRole = localStorage.getItem(this.USER_ROLE_KEY);
    return !!(token && userRole === 'admin');
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    const res = await fetch('http://localhost:5000/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isAdmin;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }
}

export const adminAuth = new AdminAuth(); 