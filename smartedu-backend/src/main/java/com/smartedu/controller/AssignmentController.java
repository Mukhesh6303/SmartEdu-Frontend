package com.smartedu.controller;

import com.smartedu.model.Assignment;
import com.smartedu.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    @GetMapping("/course/{course}")
    public List<Assignment> getAssignmentsByCourse(@PathVariable String course) {
        return assignmentRepository.findByCourse(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Assignment updated) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setTitle(updated.getTitle());
            assignment.setDescription(updated.getDescription());
            assignment.setDueDate(updated.getDueDate());
            assignment.setMaxMarks(updated.getMaxMarks());
            assignment.setCourse(updated.getCourse());
            assignment.setAttachments(updated.getAttachments());
            return ResponseEntity.ok(assignmentRepository.save(assignment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
