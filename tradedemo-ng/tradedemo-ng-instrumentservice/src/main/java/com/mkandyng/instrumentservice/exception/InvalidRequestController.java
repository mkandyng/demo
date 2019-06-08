package com.mkandyng.instrumentservice.exception;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class InvalidRequestController implements ErrorController {
    private static final String ERROR_REQUEST = "/error";

    @RequestMapping(ERROR_REQUEST)
    @ResponseBody
    public void handleError(HttpServletRequest request) {
        String originalUrl = (String) request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        if(originalUrl == null) {
            originalUrl = ERROR_REQUEST;
        }
        throw new ResourceNotFoundException(String.format("Invalid Rest URL [%s]", originalUrl));
    }

    @Override
    public String getErrorPath() {
        return ERROR_REQUEST;
    }
}
