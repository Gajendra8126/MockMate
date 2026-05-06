import config from './config/config.js';

const url = "https://openrouter.ai/api/v1/chat/completions";
const headers = {
    "Authorization": `Bearer ${config.openRouter.apiKey}`,
    "Content-Type": "application/json"
};

const SYSTEM_PROMPT = `
You are a database mock data expert. Your job is to analyze an array of database schemas and map every field to the most semantically appropriate Faker.js (v8) function.

RULES:
1. Return ONLY a JSON object containing a "rulebook" array.
2. If a field has a "ref" or "refPath", set "fakerCall" to null and "isReference" to true.
3. If "refPath" is present, extract the possible target collections into an "enum" array. If it is NOT a reference, "enum" MUST be an empty array [].
4. For normal fields (including standard Mongoose enums), set "fakerCall" to an executable Faker.js string.
5. NEVER invent Faker functions. If unsure, fallback to "faker.string.alphanumeric(16)".
6. Pass the exact Mongoose "type" (String, Number, Boolean, Date) from the input to the output.
7. If the type is "Map", set fakerCall to null. We will handle it internally.

OUTPUT FORMAT:
{
  "rulebook": [
    {
      "collectionName": "string",
      "fields": [
        {
          "name": "string",
          "type": "string", 
          "fakerCall": "string | null",
          "isReference": boolean,
          "ref": "string | null",
          "refPath": "string | null",
          "enum": ["string"]
        }
      ]
    }
  ]
}
`;

const allExtractedSchemas = [
    {
        "collectionName": "address.model",
        "fields": [
            {
                "name": "user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "label",
                "type": "String"
            },
            {
                "name": "fullName",
                "type": "String"
            },
            {
                "name": "street",
                "type": "String"
            },
            {
                "name": "city",
                "type": "String"
            },
            {
                "name": "state",
                "type": "String"
            },
            {
                "name": "zipCode",
                "type": "String"
            },
            {
                "name": "country",
                "type": "String"
            },
            {
                "name": "phone",
                "type": "String"
            },
            {
                "name": "isDefault",
                "type": "Boolean"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "brand.model",
        "fields": [
            {
                "name": "name",
                "type": "String"
            },
            {
                "name": "slug",
                "type": "String"
            },
            {
                "name": "description",
                "type": "String"
            },
            {
                "name": "logo",
                "type": "String"
            },
            {
                "name": "website",
                "type": "String"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "cart.model",
        "fields": [
            {
                "name": "user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "items[].product",
                "type": "ObjectId",
                "ref": "Product"
            },
            {
                "name": "items[].variant.sku",
                "type": "String"
            },
            {
                "name": "items[].variant.options",
                "type": "Map"
            },
            {
                "name": "items[].quantity",
                "type": "Number"
            },
            {
                "name": "items[].price",
                "type": "Number"
            },
            {
                "name": "coupon.code",
                "type": "String"
            },
            {
                "name": "coupon.discount",
                "type": "Number"
            },
            {
                "name": "coupon.discountType",
                "type": "String",
                "enum": [
                    "fixed",
                    "percentage"
                ]
            },
            {
                "name": "notes",
                "type": "String"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "category.model",
        "fields": [
            {
                "name": "name",
                "type": "String"
            },
            {
                "name": "slug",
                "type": "String"
            },
            {
                "name": "description",
                "type": "String"
            },
            {
                "name": "parent",
                "type": "ObjectId",
                "ref": "Category"
            },
            {
                "name": "image",
                "type": "String"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "coupon.model",
        "fields": [
            {
                "name": "code",
                "type": "String"
            },
            {
                "name": "description",
                "type": "String"
            },
            {
                "name": "discountType",
                "type": "String",
                "enum": [
                    "fixed",
                    "percentage"
                ]
            },
            {
                "name": "discountValue",
                "type": "Number"
            },
            {
                "name": "minOrderAmount",
                "type": "Number"
            },
            {
                "name": "maxDiscount",
                "type": "Number"
            },
            {
                "name": "usageLimit",
                "type": "Number"
            },
            {
                "name": "usedCount",
                "type": "Number"
            },
            {
                "name": "startDate",
                "type": "Date"
            },
            {
                "name": "endDate",
                "type": "Date"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "applicableCategories[]",
                "type": "ObjectId",
                "ref": "Category"
            },
            {
                "name": "applicableProducts[]",
                "type": "ObjectId",
                "ref": "Product"
            },
            {
                "name": "userLimit",
                "type": "Number"
            },
            {
                "name": "usedBy[]",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "order.model",
        "fields": [
            {
                "name": "user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "orderNumber",
                "type": "String"
            },
            {
                "name": "items[].product",
                "type": "ObjectId",
                "ref": "Product"
            },
            {
                "name": "items[].name",
                "type": "String"
            },
            {
                "name": "items[].image",
                "type": "String"
            },
            {
                "name": "items[].price",
                "type": "Number"
            },
            {
                "name": "items[].quantity",
                "type": "Number"
            },
            {
                "name": "items[].variant.sku",
                "type": "String"
            },
            {
                "name": "items[].variant.options",
                "type": "Map"
            },
            {
                "name": "shippingAddress.fullName",
                "type": "String"
            },
            {
                "name": "shippingAddress.street",
                "type": "String"
            },
            {
                "name": "shippingAddress.city",
                "type": "String"
            },
            {
                "name": "shippingAddress.state",
                "type": "String"
            },
            {
                "name": "shippingAddress.zipCode",
                "type": "String"
            },
            {
                "name": "shippingAddress.country",
                "type": "String"
            },
            {
                "name": "shippingAddress.phone",
                "type": "String"
            },
            {
                "name": "paymentInfo.method",
                "type": "String",
                "enum": [
                    "credit_card",
                    "paypal",
                    "stripe",
                    "cod"
                ]
            },
            {
                "name": "paymentInfo.transactionId",
                "type": "String"
            },
            {
                "name": "paymentInfo.status",
                "type": "String",
                "enum": [
                    "pending",
                    "completed",
                    "failed",
                    "refunded"
                ]
            },
            {
                "name": "paymentInfo.paidAt",
                "type": "Date"
            },
            {
                "name": "itemsPrice",
                "type": "Number"
            },
            {
                "name": "taxPrice",
                "type": "Number"
            },
            {
                "name": "shippingPrice",
                "type": "Number"
            },
            {
                "name": "discountPrice",
                "type": "Number"
            },
            {
                "name": "totalPrice",
                "type": "Number"
            },
            {
                "name": "orderStatus",
                "type": "String",
                "enum": [
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                    "returned"
                ]
            },
            {
                "name": "trackingNumber",
                "type": "String"
            },
            {
                "name": "expectedDeliveryDate",
                "type": "Date"
            },
            {
                "name": "deliveredAt",
                "type": "Date"
            },
            {
                "name": "cancelledAt",
                "type": "Date"
            },
            {
                "name": "cancelReason",
                "type": "String"
            },
            {
                "name": "notes",
                "type": "String"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "product.model",
        "fields": [
            {
                "name": "name",
                "type": "String"
            },
            {
                "name": "slug",
                "type": "String"
            },
            {
                "name": "description",
                "type": "String"
            },
            {
                "name": "richDescription",
                "type": "String"
            },
            {
                "name": "images[].url",
                "type": "String"
            },
            {
                "name": "images[].alt",
                "type": "String"
            },
            {
                "name": "brand",
                "type": "ObjectId",
                "ref": "Brand"
            },
            {
                "name": "category",
                "type": "ObjectId",
                "ref": "Category"
            },
            {
                "name": "subcategory",
                "type": "ObjectId",
                "ref": "Category"
            },
            {
                "name": "price",
                "type": "Number"
            },
            {
                "name": "compareAtPrice",
                "type": "Number"
            },
            {
                "name": "currency",
                "type": "String"
            },
            {
                "name": "inventory",
                "type": "Number"
            },
            {
                "name": "sku",
                "type": "String"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "isFeatured",
                "type": "Boolean"
            },
            {
                "name": "options[].name",
                "type": "String"
            },
            {
                "name": "options[].values[]",
                "type": "String"
            },
            {
                "name": "variants[].sku",
                "type": "String"
            },
            {
                "name": "variants[].options",
                "type": "Map"
            },
            {
                "name": "variants[].price",
                "type": "Number"
            },
            {
                "name": "variants[].inventory",
                "type": "Number"
            },
            {
                "name": "variants[].image",
                "type": "String"
            },
            {
                "name": "tags[]",
                "type": "String"
            },
            {
                "name": "reviews[].user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "reviews[].rating",
                "type": "Number"
            },
            {
                "name": "reviews[].comment",
                "type": "String"
            },
            {
                "name": "reviews[].isVerifiedPurchase",
                "type": "Boolean"
            },
            {
                "name": "ratingsAverage",
                "type": "Number"
            },
            {
                "name": "ratingsQuantity",
                "type": "Number"
            },
            {
                "name": "soldCount",
                "type": "Number"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "review.model",
        "fields": [
            {
                "name": "product",
                "type": "ObjectId",
                "ref": "Product"
            },
            {
                "name": "user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "order",
                "type": "ObjectId",
                "ref": "Order"
            },
            {
                "name": "rating",
                "type": "Number"
            },
            {
                "name": "title",
                "type": "String"
            },
            {
                "name": "comment",
                "type": "String"
            },
            {
                "name": "images[]",
                "type": "String"
            },
            {
                "name": "isVerifiedPurchase",
                "type": "Boolean"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "user.model",
        "fields": [
            {
                "name": "name",
                "type": "String"
            },
            {
                "name": "email",
                "type": "String"
            },
            {
                "name": "password",
                "type": "String"
            },
            {
                "name": "role",
                "type": "String",
                "enum": [
                    "customer",
                    "admin"
                ]
            },
            {
                "name": "addresses[].street",
                "type": "String"
            },
            {
                "name": "addresses[].city",
                "type": "String"
            },
            {
                "name": "addresses[].state",
                "type": "String"
            },
            {
                "name": "addresses[].zipCode",
                "type": "String"
            },
            {
                "name": "addresses[].country",
                "type": "String"
            },
            {
                "name": "addresses[].isDefault",
                "type": "Boolean"
            },
            {
                "name": "phone",
                "type": "String"
            },
            {
                "name": "isActive",
                "type": "Boolean"
            },
            {
                "name": "refreshToken",
                "type": "String"
            },
            {
                "name": "passwordChangedAt",
                "type": "Date"
            },
            {
                "name": "passwordResetToken",
                "type": "String"
            },
            {
                "name": "passwordResetExpires",
                "type": "Date"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    },
    {
        "collectionName": "wishlist.model",
        "fields": [
            {
                "name": "user",
                "type": "ObjectId",
                "ref": "User"
            },
            {
                "name": "products[]",
                "type": "ObjectId",
                "ref": "Product"
            },
            {
                "name": "createdAt",
                "type": "Date"
            },
            {
                "name": "updatedAt",
                "type": "Date"
            }
        ]
    }
];

const payload = {
    "model": "tencent/hy3-preview:free",
    "messages": [
        {
            "role": "system",
            "content": `{${SYSTEM_PROMPT}`
        },
        {
            "role": "user",
            "content": `All Schemas:\n{${allExtractedSchemas}}`
        }
    ],
    "temperature": 0.3
};

const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
});

const data = await response.json();
console.log(data);