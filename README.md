# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# End-Point Explanation:

I. PUBLIC ROUTING:

  1. / --> Web application Dashboard.
  2. /register --> Create new Registration page. [ REQUIRED : firstname, lastname, email, password ]
  3. /verify-register-token/:registerToken --> Verify the registerer through registration link.
  4. /login --> Login page. [ Required : email, password ]
  5. /password-reset --> Verify user email and send password reset token with url. [ Required : email ]
  6. /verify-password-token/:passResetToken --> Verify token and redirect to update password page.
  7. /password-reset/:passResetToken --> Update new Password. [ Required : newPassword ]
  8. /:shortURL --> Check Shorten URL and redirect User to actual website.

II. PRIVATE ROUTING:

  1. /addUrl --> Create Shorten URL for User. [ REQUIRED : longUrl ]
  2. /getUrl --> Get All Shorten URL's created by logged-in User.
  3. /logout --> Logout user by deleting auth-Token from header.

# npm requires:

  1. react vite
  2. react-router-dom
  3. jet-decode
  4. axios
