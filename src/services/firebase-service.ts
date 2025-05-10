import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  UserCredential,
  Auth, 
  User, 
  onAuthStateChanged,
  signOut,
  getIdToken
} from 'firebase/auth';
import { Environment } from '../config/environment';
import { logInfo, logError } from '../utils/logger';

class FirebaseService {
  private auth: Auth;
  private currentUser: User | null = null;
  private initialized: boolean = false;

  constructor() {
    // Firebaseの設定
    const firebaseConfig = {
      apiKey: Environment.FIREBASE_API_KEY,
      authDomain: Environment.FIREBASE_AUTH_DOMAIN,
      projectId: Environment.FIREBASE_PROJECT_ID,
      storageBucket: Environment.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: Environment.FIREBASE_MESSAGING_SENDER_ID,
      appId: Environment.FIREBASE_APP_ID,
    };

    // Firebaseの初期化
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    // 認証状態の監視
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        logInfo(`Firebaseユーザーとして認証されました: ${user.email}`, 'Firebase');
      } else {
        this.currentUser = null;
        logInfo('Firebaseからログアウトしました', 'Firebase');
      }
    });
  }

  /**
   * 初期化済みかどうかを返す
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * ログイン済みかどうかを返す
   */
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  /**
   * Firebaseにログインする
   * @param email メールアドレス
   * @param password パスワード
   * @returns ユーザー認証情報
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser = userCredential.user;
      this.initialized = true;
      logInfo(`Firebase認証に成功しました: ${email}`, 'Firebase');
      return userCredential;
    } catch (error) {
      logError('Firebase認証に失敗しました', error instanceof Error ? error : new Error(String(error)), 'Firebase');
      throw error;
    }
  }

  /**
   * Firebaseからログアウトする
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      logInfo('Firebaseからログアウトしました', 'Firebase');
    } catch (error) {
      logError('Firebaseログアウト中にエラーが発生しました', error instanceof Error ? error : new Error(String(error)), 'Firebase');
      throw error;
    }
  }

  /**
   * 現在のユーザーのIDトークンを取得する
   * @param forceRefresh トークンを強制的に更新するかどうか
   * @returns IDトークン
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string> {
    if (!this.currentUser) {
      throw new Error('ユーザーが認証されていません');
    }

    try {
      return await getIdToken(this.currentUser, forceRefresh);
    } catch (error) {
      logError('IDトークンの取得に失敗しました', error instanceof Error ? error : new Error(String(error)), 'Firebase');
      throw error;
    }
  }

  /**
   * 現在のユーザーを取得する
   * @returns 現在のユーザー
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

// シングルトンとしてエクスポート
export const firebaseService = new FirebaseService();