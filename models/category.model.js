const sql = require('../db/db');

const { checkCategoryLength } = require('../helpers/validation.helper');

const Category = function(category) {
    this.category = category.category;
}

Category.getCategories = callback => {
    sql.query("SELECT * FROM categories", (err, res) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }

        callback(null, res);
    });

}

Category.getCategoryById = (id, callback) => {
    sql.query("SELECT * FROM categories WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }

        if (res.length) {
            callback(null, res[0]);
            return;
        }

        callback({kind: 'not_found'}, null);
    });
}

Category.getCategoryByName = (categoryName, callback) => {
    sql.query("SELECT * FROM categories WHERE category = ?", categoryName, (err, res) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }

        if (res.length) {
            callback(null, res[0]);
            return;
        }

        callback({kind: 'not_found'}, null);
    });
}

Category.addCategory = (newCategory, callback) => {
    sql.query(
        "INSERT INTO categories VALUES (?, ?)",
        [null, newCategory.category],
        (err, res) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            callback(null, {
                id: res.insertId,
                category: newCategory.category
            });
        }            
    );    
};

Category.updateCategory = (id, category, callback) => {
    sql.query(
        "UPDATE categories SET category = ? WHERE id = ?",
        [category.category, id],
        (err, res) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                callback({kind: "not_found"}, null);
                return;
            }

            callback(null, {id: id, ...category});
        }
    );

}

Category.deleteCategory = (id, callback) => {
    sql.query("DELETE FROM todos where categoryId = ?", id, (err, res) => {
        if (err) {
            console.log(err);
            callback(null, err);
            return;
        }
        
        sql.query("DELETE FROM categories WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log(err);
                callback(null, err);
                return;
            }
            
            if (res.affectedRows == 0) {
                callback({kind: "not_found"}, null);
                return;
            }
            
            callback(null, res);
        });
    });
}

module.exports = Category;