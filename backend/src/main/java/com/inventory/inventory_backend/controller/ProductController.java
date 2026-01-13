// Validates Stock Levels and Batch Processing for High-Volume Inventory
package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.model.Product;
import com.inventory.inventory_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private static final String UPLOAD_DIR = "src/main/resources/static/product-images/";

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("quantity") int quantity,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setQuantity(quantity);
        product.setPrice(price);

        try {
            if (image != null && !image.isEmpty()) {
                String fileName = StringUtils.cleanPath(image.getOriginalFilename());
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.copy(image.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                product.setImagePath(fileName);
            }
        } catch (IOException e) {
            e.printStackTrace(); // helpful for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }

        return ResponseEntity.ok(productService.save(product));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("quantity") int quantity,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        Product existingProduct = productService.getById(id);

        if (existingProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        existingProduct.setName(name);
        existingProduct.setCategory(category);
        existingProduct.setQuantity(quantity);
        existingProduct.setPrice(price);

        try {
            if (image != null && !image.isEmpty()) {
                String fileName = StringUtils.cleanPath(image.getOriginalFilename());
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.copy(image.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                existingProduct.setImagePath(fileName);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }

        return ResponseEntity.ok(productService.save(existingProduct));
    }



    @GetMapping("")
    public List<Product> getAllProducts() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PutMapping("/stock-in/{id}")
    public ResponseEntity<?> stockIn(@PathVariable Long id, @RequestParam int amount) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        product.setQuantity(product.getQuantity() + amount);
        productService.save(product);
        return ResponseEntity.ok("Stock increased successfully");
    }

    @PutMapping("/stock-out/{id}")
    public ResponseEntity<?> stockOut(@PathVariable Long id, @RequestParam int amount) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        if (product.getQuantity() < amount) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not enough stock");
        }

        product.setQuantity(product.getQuantity() - amount);
        productService.save(product);
        return ResponseEntity.ok("Stock decreased successfully");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}

