# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of Login page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-login.jpg)
!["screenshot of Registration page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-register.jpg)
!["screenshot of New URL page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-new.jpg)

## Dependencies (current version)

    "express": "^4.18.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.0",
    "bootstrap": "^5.2.0-beta1",
    "cookie-session": "^2.0.0",
    "ejs": "^3.1.8",
    "morgan": "^1.10.0"


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Known bugs
Compass ask redirect users after logout to /urls - and its get an error message after redirect
- if user is not logged in: returns HTML with a relevant error message