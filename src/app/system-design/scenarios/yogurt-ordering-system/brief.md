# Design a Yogurt Ordering System

## Overview

Design the backend system for a frozen yogurt ordering application.

- A backend API and a separate frontend application
- Customers place orders through the app
- Employees manage and fulfill orders

## Functional Requirements

- Customers can choose a yogurt **size** (sizes have fixed prices)
- Customers can choose one **base yogurt flavor** per order
- Customers can add **toppings** to their order
  - Toppings are added by the scoop
  - Each topping has a **weight per scoop**
  - Any number and combination of toppings can be added
  - The yogurt itself does not contribute to weight
- Each order has a **maximum allowed weight** determined by the chosen size
- Toppings contribute to the order's total weight
- Employees can **update order statuses**
- Customers can **view their order status**

## What you should design

- The database schema
- The key API endpoints
- Any constraints or validation logic worth calling out
