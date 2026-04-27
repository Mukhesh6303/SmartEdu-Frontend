package com.smartedu.repository;

import com.smartedu.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStudentEmail(String studentEmail);
    Optional<Submission> findByAssignmentIdAndStudentEmail(Long assignmentId, String studentEmail);
}
