package com.restaurant.pattern.state;

import com.restaurant.model.enums.DishStatus;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Factory class để tạo State object từ DishStatus
 * Sử dụng Map thay vì if-else để tuân thủ nguyên tắc OOSD
 */
public class StateFactory {

    // Map lưu trữ mapping giữa DishStatus và State constructor
    private static final Map<DishStatus, Supplier<DishState>> STATE_MAP = new HashMap<>();

    // Static block để khởi tạo mapping
    static {
        STATE_MAP.put(DishStatus.ORDERED, OrderedState::new);
        STATE_MAP.put(DishStatus.COOKING, CookingState::new);
        STATE_MAP.put(DishStatus.READY, ReadyState::new);
        STATE_MAP.put(DishStatus.SERVED, ServedState::new);
    }

    /**
     * Tạo State object từ DishStatus
     * Không sử dụng if-else, sử dụng Map lookup thay thế
     */
    public static DishState createState(DishStatus status) {
        Supplier<DishState> stateSupplier = STATE_MAP.get(status);
        
        // Nếu không tìm thấy, trả về OrderedState mặc định
        return stateSupplier != null ? stateSupplier.get() : new OrderedState();
    }
}
