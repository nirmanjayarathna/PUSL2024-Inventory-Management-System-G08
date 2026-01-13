package com.inventory.inventory_backend.repository;

import com.inventory.inventory_backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
