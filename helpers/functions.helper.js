module.exports = {
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    hasUpperCase(text) {
        for (index = 0; index < text.length; index++) {
            if (text.charAt(index) >= 'A' && text.charAt(index) <= 'Z') return true;
        }

        return false;
    },
    trimValue(value) {
        value += "";
        return value = value.trim();
    }
};
