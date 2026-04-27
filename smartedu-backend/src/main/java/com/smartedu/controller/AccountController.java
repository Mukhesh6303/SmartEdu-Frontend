package com.smartedu.controller;

import com.smartedu.model.Account;
import com.smartedu.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Account loginRequest) {
        Optional<Account> accountOpt = accountRepository.findByEmail(loginRequest.getEmail());
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            if (account.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(account);
            }
        }
        return ResponseEntity.status(401).body("{\"error\": \"Invalid credentials\"}");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account account) {
        if (accountRepository.findByEmail(account.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email already exists\"}");
        }
        Account savedAccount = accountRepository.save(account);
        return ResponseEntity.ok(savedAccount);
    }
}
