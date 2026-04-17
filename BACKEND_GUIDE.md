# 백엔드 API 가이드

## API 목록

| API | 응답 | 용도 |
|-----|------|------|
| `GET /menus` | `[{ id, title, description }]` | 목록 (가볍게) |
| `POST /menus` | `{ id, title, description }` | 메뉴 생성 |
| `GET /menus/{id}` | `{ id, title, description, steps: [...] }` | 상세 (한 번에) |

---

## 메뉴 생성 (POST /menus)

### Request Body
```json
{
  "title": "김치찌개",
  "description": "맛있는 김치찌개"
}
```

id는 보내지 않는다. JPA `@GeneratedValue`가 자동 생성.

---

## 메뉴 상세 (GET /menus/{id})

### Response 예시
```json
{
  "id": 1,
  "title": "김치찌개",
  "description": "맛있는 김치찌개",
  "steps": [
    { "id": 1, "stepNumber": 1, "description": "물을 끓인다" },
    { "id": 2, "stepNumber": 2, "description": "김치를 넣는다" }
  ]
}
```

### 구현 방법

1. **Step 엔티티** 만들기 (`id`, `stepNumber`, `description`, `menu`)
2. Menu 엔티티에 `@OneToMany` 연관관계 추가 (FetchType.LAZY 기본값 유지)
3. **MenuDetailResponseDto** 만들어서 Menu + Steps 조합해서 응답
   - 엔티티를 직접 JSON으로 내려주면 순환참조 등 문제 생김 → DTO 사용

### 왜 DTO를 쓰는가

- `@OneToMany`는 기본이 `LAZY` → `menu.getSteps()` 호출할 때만 DB 조회
- 목록 API에서는 steps를 안 건드리니까 쿼리 낭비 없음
- 상세 API 서비스에서만 `menu.getSteps()` 호출해서 DTO에 담으면 됨
- EAGER로 바꾸면 목록 조회할 때도 매번 steps 전부 조회해서 비효율적

### Step 엔티티 예시

```java
@Entity
public class Step {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int stepNumber;

    private String description;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;
}
```

### MenuDetailResponseDto 예시

```java
@Getter
@AllArgsConstructor
public class MenuDetailResponseDto {
    private Long id;
    private String title;
    private String description;
    private List<StepResponseDto> steps;
}
```

---

## CORS

컨트롤러에 `@CrossOrigin(origins = "http://localhost:5173")` 필요 (프론트 Vite 포트).
