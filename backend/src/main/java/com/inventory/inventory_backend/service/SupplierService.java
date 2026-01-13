package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.model.Supplier;
import com.inventory.inventory_backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public Supplier save(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}
