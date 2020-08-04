const Category = require('../models/category.model');
const { isValidSubmit } = require('../helpers/validation.helper');

exports.getCategories = (req, res) => {
    Category.getCategories((err, data) => {
        if (err) {
            res.status(500)
                .send({ message: 'Something went terribly wrong...' });
        }
        else res.send(data);
    });
}

exports.getCategoryById = (req, res) => {
    Category.getCategoryById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404)
                    .send({ message: "Band Not Found" });
            } else {
                res.status(500)
                    .send({ message: 'Something went terribly wrong...' });
            }
        } else res.send(data);
    });

}

exports.addCategory = (req, res) => {
    const { category} = req.body;

    // Checks to see if the form is filed in
    if (!isValidSubmit(category)) {
        res.status(406).send({message: "Please enter category!"});
        return;
    }

    // Check to see if the given category already exists
    Category.getCategoryByName(category, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {

                const newCategory = new Category({           
                    category: category
                });
                
                //add category
                Category.addCategory(newCategory, (err, data) => {
                    if (err) res.status(500).send({message: "Something went terribly wrong..."});
                    // create category was successful
                    else res.status(201).send(data);               
                });

           }
            // Something went wrong in the server
            else res.status(500).send({message: "Something went terribly wrong..."});
        } 
        // The category already exists
        else res.status(406).send({message: "This category already exists!"});
    });
}

exports.updateCategory = (req, res) => {
    const { category } = req.body;

    if (!isValidSubmit(category)) {
        res.status(400).send({ message: "Please fill in the details"});
        return;
    }

    const updateCategory = new Category({           
        category: category
    });

    Category.updateCategory(req.params.id, updateCategory, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404)
                    .send({ message: "Category Not Found" });
            }
            else {
                res.status(500)
                    .send({ message: "Something went terribly wrong..." });
            }
        }
        else res.send(data);
    });
}

exports.deleteCategory = (req, res) => {
    const id = req.params.id;

    Category.deleteCategory(id, (err, data)=> {
        if (err){
            if (err.kind === "not_found") {
                res.status(404)
                    .send({message: "category not found"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.status(200).send();
    });
}