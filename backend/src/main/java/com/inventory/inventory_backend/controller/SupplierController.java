// Controller for Supplier Registration Logic
package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.model.Supplier;
import com.inventory.inventory_backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin("*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierService.save(supplier);
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAll();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierService.getById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        Supplier existing = supplierService.getById(id);
        if (existing == null) {
            return ResponseEntity.status(404).body("Supplier not found");
        }

        existing.setName(supplier.getName());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setCompany(supplier.getCompany());

        supplierService.save(existing);
        return ResponseEntity.ok(existing);
    }
}

