package com.smartedu.repository;

import com.smartedu.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentEmail(String studentEmail);
    Optional<Enrollment> findByStudentEmailAndCourseId(String studentEmail, Long courseId);
}
