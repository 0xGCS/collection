
The categorization model was restructured from product-level category fields into a normalized topic and category hierarchy.

### **Previous structure**

Products were categorized directly using:

- `primary_category`
- `primary_subcategory`
- `tags`

In practice:

```text
primary_category    = broad subject area
primary_subcategory = product type
tags                = flexible attributes
```

Products stored both their broad category and subcategory directly.

### **New terminology**

The fields were renamed to make the hierarchy clearer:

|**Previous term**|**New term**|**Meaning**|
|---|---|---|
|`primary_category`|`topic`|Broad subject area|
|`primary_subcategory`|`category`|Specific product type|
|`tags`|`tags`|Flexible product attributes|

## **Relationship changes**

Products no longer map directly to topics.

The new relationship is:

```text
product → category → topic
```

- Each category belongs to exactly one topic.
- A product can belong to between one and three categories. Since each category has a parent topic, a product’s topics can be derived through its category assignments.
- A product can indirectly belong to multiple topics when its categories belong to different topics
## **New tables created**

### **`topics`**

Stores the broad subject areas.

Typical columns:

```text
id
name
slug
description
created_at
```

Example:

```text
name: Crypto
slug: crypto
```

### **`categories`**

Stores the specific product types.

Each category has a foreign key to one topic.

Typical columns:

```text
id
topic_id
name
slug
description
created_at
```

Example:

```text
name: Wallets
slug: crypto-wallets
topic_id: Crypto topic UUID
```

Topic-prefixed slugs were used because some category names appear under multiple topics, such as:

```text
engineering-infrastructure
crypto-infrastructure
```

### **`product_categories`**

A junction table was created to support the many-to-many relationship between products and categories.

Typical columns:

```text
product_id
category_id
created_at
```

Its composite primary key is:

```text
(product_id, category_id)
```

This prevents the same product-category mapping from being inserted twice.

A product with three categories has three rows in this table:

```text
product A → category 1
product A → category 2
product A → category 3
```

The `category_id` remains a single UUID. It was not changed to an array.

## 

## 

## **Existing**

**`collection`**

**table**

The `collection` table remains the main product table.

The old categorization columns:

```text
primary_category
primary_subcategory
```

are intended to be phased out after the migration is validated.

The `tags` column remains on the product because tags describe flexible attributes such as:

```text
open-source
api
developers
freemium
python
stablecoins
```

## **Final data model**

```text
collection
- id
- name
- description
- features
- tags
- other product fields

topics
- id
- name
- slug
- description

categories
- id
- topic_id
- name
- slug
- description

product_categories
- product_id
- category_id
```

