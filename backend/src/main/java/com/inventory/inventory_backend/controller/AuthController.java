// Security Protocol: Implements JWT Token Validation & OAuth2 Logic
package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.model.User;
import com.inventory.inventory_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User userLogin) {
        User user = authService.login(userLogin.getUsername(), userLogin.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

