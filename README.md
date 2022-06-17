# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of Login page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-login.jpg)
!["screenshot of Registration page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-register.jpg)
!["screenshot of New URL page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-new.jpg)
!["screenshot of Main page"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-urls.jpg)
!["screenshot of URL edit page with counters"](https://github.com/ukflava/tinyApp/blob/main/docs/Tiny-edit-with-counter.jpg)


## Dependencies (current version)

    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.0",
    "bootstrap": "^5.2.0-beta1",
    "cookie-session": "^2.0.0",
    "ejs": "^3.1.8",
    "express": "^4.18.1",
    "morgan": "^1.10.0"
    "method-override": "^3.0.0",


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server1.js` command.

## Known bugs
*Compass require to redirect users after logout to /urls - Tinyapp send client an error message after redirect
- if user is not logged in: returns HTML with a relevant error message

*Checker of unique visitors works ONLY if all users can visit short URL page, but requested logic says: 
- if user is logged it but does not own the URL with the given ID: returns HTML with a relevant error message
