const getPriority = (due_date) => {
    const today = new Date();
    const dueDate = new Date(due_date);
    let priority;

    if (dueDate.toDateString() === today.toDateString()) {
        priority = 0;
    } else {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        if (dueDate > tomorrow && dueDate <= dayAfterTomorrow) {
            priority = 1;
        } else if (dueDate > dayAfterTomorrow && dueDate <= today.setDate(today.getDate() + 4)) {
            priority = 2;
        } else {
            priority = 3;
        }
    }

    return priority;
}

module.exports = getPriority;