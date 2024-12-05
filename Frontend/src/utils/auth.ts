
export const setTokenLocal = (token: string) => {
    localStorage.setItem('user', token);
};

export const getTokenLocal = (): string | null => {
    return localStorage.getItem('user');
};

export const clearTokenLocal = () => {
    localStorage.removeItem('user');
};
