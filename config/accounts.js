const passwordField = AccountsTemplates.removeField('password');
const emailField = AccountsTemplates.removeField('email');

AccountsTemplates.addFields([{
  _id: 'username',
  type: 'text',
  displayName: 'username',
  required: true,
  minLength: 2,
}, passwordField
]);

AccountsTemplates.configure({
  // Behavior
  confirmPassword: false,
  enablePasswordChange: false,
  forbidClientAccountCreation: true,
  // overrideLoginErrors: true,
  sendVerificationEmail: true,
  // lowercaseUsername: false,
  // focusFirstInput: true,

  // Appearance
  // showAddRemoveServices: false,
  showForgotPasswordLink: false,
  // showLabels: true,
  // showPlaceholders: true,
  // showResendVerificationEmailLink: false,

  // Client-side Validation
  // continuousValidation: false,
  // negativeFeedback: false,
  // negativeValidation: true,
  // positiveValidation: true,
  // positiveFeedback: true,
  // showValidating: true,

  defaultLayout: 'userFormsLayout',
  defaultContentRegion: 'content',
  // Hooks
  onLogoutHook() {
    const homePage = 'home';
    if (FlowRouter.getRouteName() === homePage) {
      FlowRouter.reload();
    } else {
      FlowRouter.go(homePage);
    }
  },
});

['signIn'].forEach(
  (routeName) => AccountsTemplates.configureRoute(routeName));

// We display the form to change the password in a popup window that already
// have a title, so we unset the title automatically displayed by useraccounts.
AccountsTemplates.configure({
  texts: {
    title: {
      changePwd: '',
    },
  },
});

if (Meteor.isServer) {

  ['resetPassword-subject', 'resetPassword-text', 'verifyEmail-subject', 'verifyEmail-text', 'enrollAccount-subject', 'enrollAccount-text'].forEach((str) => {
    const [templateName, field] = str.split('-');
    Accounts.emailTemplates[templateName][field] = (user, url) => {
      return TAPi18n.__(`email-${str}`, {
        url,
        user: user.getName(),
        siteName: Accounts.emailTemplates.siteName,
      }, user.getLanguage());
    };
  });
}
