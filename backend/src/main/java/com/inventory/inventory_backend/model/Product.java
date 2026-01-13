package com.inventory.inventory_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private int quantity;
    private double price;

    // Stores only the filename (image.jpg)
    private String imagePath;
}
