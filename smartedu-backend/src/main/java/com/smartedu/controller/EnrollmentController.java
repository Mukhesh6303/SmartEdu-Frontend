package com.smartedu.controller;

import com.smartedu.model.Enrollment;
import com.smartedu.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> enroll(@RequestBody Enrollment enrollment) {
        if (enrollmentRepository.findByStudentEmailAndCourseId(enrollment.getStudentEmail(), enrollment.getCourseId()).isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Already enrolled\"}");
        }
        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    @GetMapping("/student/{email}")
    public List<Enrollment> getStudentEnrollments(@PathVariable String email) {
        return enrollmentRepository.findByStudentEmail(email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unenroll(@PathVariable Long id) {
        enrollmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
