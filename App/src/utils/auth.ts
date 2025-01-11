import AsyncStorage from '@react-native-async-storage/async-storage';

const setTokenLocal = async (token: string) => {
    try {
        await AsyncStorage.setItem('user', token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

const getUsernameLocal = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('name');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const clearUsernameLocal = async () => {
    try {
        await AsyncStorage.removeItem('name');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
};
const setUsernameLocal = async (name: string) => {
    try {
        await AsyncStorage.setItem('name', name);
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

const getTokenLocal = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('user');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const clearTokenLocal = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
};


export { clearTokenLocal, getTokenLocal, setTokenLocal, clearUsernameLocal, getUsernameLocal, setUsernameLocal };