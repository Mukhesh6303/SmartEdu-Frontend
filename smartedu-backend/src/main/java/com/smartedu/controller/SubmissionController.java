package com.smartedu.controller;

import com.smartedu.model.Submission;
import com.smartedu.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> submitAssignment(@RequestBody Submission submission) {
        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentEmail(submission.getAssignmentId(), submission.getStudentEmail());
        if (existing.isPresent()) {
            Submission sub = existing.get();
            sub.setContent(submission.getContent());
            return ResponseEntity.ok(submissionRepository.save(sub));
        }

        submission.setStatus("submitted");
        return ResponseEntity.ok(submissionRepository.save(submission));
    }

    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @GetMapping("/student/{email}")
    public List<Submission> getSubmissionsByStudent(@PathVariable String email) {
        return submissionRepository.findByStudentEmail(email);
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<Submission> gradeSubmission(@PathVariable Long id, @RequestBody Submission updated) {
        return submissionRepository.findById(id).map(submission -> {
            submission.setMarks(updated.getMarks());
            submission.setFeedback(updated.getFeedback());
            submission.setStatus("graded");
            return ResponseEntity.ok(submissionRepository.save(submission));
        }).orElse(ResponseEntity.notFound().build());
    }
}
