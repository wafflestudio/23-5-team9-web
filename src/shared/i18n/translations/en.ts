import type { TranslationKeys } from './ko';

export const en: TranslationKeys = {
  // Common
  common: {
    loading: 'Loading...',
    processing: 'Processing...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    unknown: 'Unknown',
    error: 'An error occurred.',
    noData: 'No data.',
    loadMore: 'Load more',
    won: 'KRW',
  },

  // Navigation
  nav: {
    products: 'Products',
    chat: 'Chat',
    myCarrot: 'My Carrot',
    login: 'Login',
    carrotMarket: 'Carrot Market',
    themeToggle: 'Toggle theme',
    langToggle: 'Toggle language',
    langLabel: 'EN',
  },

  // Auth
  auth: {
    login: 'Login',
    signup: 'Sign up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    passwordConfirm: 'Confirm password',
    passwordMin: 'Password (8+ characters)',
    loggingIn: 'Logging in...',
    signingUp: 'Signing up...',
    next: 'Next',
    continueWithGoogle: 'Continue with Google',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    networkError: 'A network error occurred.',
    invalidCredentials: 'Email or password is incorrect.',
    signupError: 'An error occurred during sign up.',
    onboardingFailed: 'Onboarding failed.',
    additionalInfo: 'Additional Information',
    onboardingDesc: 'Please set your nickname, region, and profile image.',
    getStarted: 'Get Started',
    onboardingRequired: 'Nickname and region settings are required to use the service!',
    goToSettings: 'Go to Settings',
    pleaseLogin: 'Please log in to continue',
    completeSettings: 'Please complete your nickname and region settings',
  },

  // Auth validation
  authValidation: {
    emailRequired: 'Please enter your email.',
    emailInvalid: 'Please enter a valid email format.',
    passwordRequired: 'Please enter your password.',
    passwordMin: 'Password must be at least 8 characters.',
    passwordConfirmRequired: 'Please confirm your password.',
    passwordMismatch: 'Passwords do not match.',
  },

  // Product
  product: {
    usedGoods: 'Used Goods',
    noSearchResults: 'No search results.',
    noProducts: 'No products available.',
    productRegistered: 'Product registered.',
    registerFailed: 'Failed to register product.',
    loadFailed: 'Failed to load product information.',
    noInfo: 'No product information.',
    seller: 'Seller',
    salesItems: "'s items",
    startChat: 'Chat',
    connecting: 'Connecting...',
    enterTitle: 'Enter product title',
    price: 'Price',
    enterDescription: 'Enter product description',
    soldOut: 'Sold',
    enterSearchQuery: 'Enter search query',
    like: 'Like',
    registerProduct: '+ Add Product',
    mySalesItems: 'My Items',
    noSalesItems: 'No items for sale.',
  },

  // Product validation
  productValidation: {
    titleRequired: 'Please enter product title.',
    priceRequired: 'Please enter price.',
    descriptionRequired: 'Please enter product description.',
  },

  // Chat
  chat: {
    chat: 'Chat',
    loginToChat: 'Log in to start chatting',
    loadFailed: 'Failed to load chat rooms.',
    noHistory: 'No chat history.',
    sendFailed: 'Failed to send message.',
    messageFailed: 'Failed to load messages.',
    otherParty: 'User',
    enterMessage: 'Enter message',
    send: 'Send',
    startConversation: 'Start a conversation',
    justNow: 'Just now',
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    cannotOpenRoom: 'Cannot open chat room.',
  },

  // Pay/Coin
  pay: {
    transactionHistory: 'Transactions',
    noTransactions: 'No transactions.',
    coinManagement: 'Coins',
    charge: 'Charge',
    withdraw: 'Withdraw',
    transfer: 'Transfer',
    received: 'Received',
    transferring: 'Transferring...',
    ownedCoins: 'Balance',
    chargeCoins: 'Charge Coins',
    withdrawCoins: 'Withdraw Coins',
    amountToTransfer: 'Amount to transfer',
    willTransferCoins: ' coins',
  },

  // User
  user: {
    myCarrot: 'My Carrot',
    myProducts: 'My Products',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    infoUpdated: 'Information updated.',
    errorOccurred: 'Error occurred',
    profileLoadFailed: 'Failed to load profile.',
    userNotFound: 'User not found.',
    sellerSalesItems: "'s Items",
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',
    passwordChanged: 'Password changed.',
    nickname: 'Nickname',
    enterNickname: 'Enter nickname',
    regionSettings: 'Region Settings',
    findMyLocation: 'Find my location',
    findMyLocationIcon: '📍 Find my location',
    savedLocationSet: 'Set to saved location.',
    currentLocationSet: 'Set to current location.',
    locationFailed: 'Location detection failed',
    selectAllRegion: 'Please select all region levels.',
  },

  // Location
  location: {
    sidoLoadFailed: 'Failed to load regions',
    syncFailed: 'Failed to sync region info',
    selectSido: 'Select Province',
    selectSigugun: 'Select City',
    selectDong: 'Select District',
    findingLocation: 'Finding location...',
    orSelectDirectly: 'or select directly',
    regionSettings: 'Region Settings',
  },

  // Layout
  layout: {
    goBack: '← Back',
  },
} as const;
