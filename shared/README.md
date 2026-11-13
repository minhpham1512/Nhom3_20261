# shared

Code dùng chung giữa frontend và backend. Hiện tại thư mục này chỉ chứa **type TypeScript sinh tự động từ [doc/swagger.yaml](../doc/swagger.yaml)**.

```
shared/
├─ src/
│  ├─ api/
│  │  ├─ openapi.gen.ts   # TỰ SINH bằng openapi-typescript, KHÔNG sửa tay
│  │  └─ types.ts         # tên gọn: User, Household, ApiError, ApiErrorBody...
│  └─ index.ts            # điểm import chung (frontend dùng `@shared`)
└─ package.json
```

## Dùng ở frontend

```ts
import type { User, ApiErrorBody } from '@shared'
```

Schema `Error` và `ValidationError` của swagger được đổi tên thành `ApiError` và `ApiValidationError` để không trùng với `Error` có sẵn của JavaScript.

## Khi swagger thay đổi

```bash
cd shared
npm install        # lần đầu
npm run gen:api
```

Sau đó:
1. Nếu swagger thêm/bớt/đổi tên schema, cập nhật danh sách alias trong `src/api/types.ts`.
2. Chạy `npm run build` trong `frontend/` để xem chỗ nào bị lệch, sửa code cho đúng swagger.
3. Commit cả `openapi.gen.ts` để người khác không cần chạy lại vẫn build được.

`openapi.gen.ts` không được sửa tay: lần sinh sau sẽ ghi đè mọi thay đổi. Muốn đổi type thì sửa `doc/swagger.yaml`.
