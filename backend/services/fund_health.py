def calculate_health_score(balance: float, reserve_floor: float) -> int:
    if balance > (reserve_floor * 2):
        return 85 # Strong
    elif balance > reserve_floor:
        return 65 # Stable
    return 30 # Critical