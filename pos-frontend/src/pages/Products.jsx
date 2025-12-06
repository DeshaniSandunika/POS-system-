import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { Layout } from '../components/Layout';
import { showError, showSuccess } from '../utils/toast';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        categoryId: product.categoryId,
      });
    } else {
      setSelectedProduct(null);
      setFormData({ name: '', description: '', price: '', quantity: '', categoryId: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
      };

      if (selectedProduct) {
        await productService.update(selectedProduct.id, submitData);
        showSuccess('Product updated successfully');
      } else {
        await productService.create(submitData);
        showSuccess('Product created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showError(error.message || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    try {
      await productService.delete(selectedProduct.id);
      showSuccess('Product deleted successfully');
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      showError(error.message || 'Failed to delete product');
    }
  };

  if (loading && products.length === 0) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No products found</p>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Create First Product
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            headers={['Name', 'Category', 'Price', 'Quantity', 'Actions']}
            data={products}
            renderRow={(product) => (
              <>
                <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">{product.category?.name}</td>
                <td className="px-6 py-4 font-semibold text-green-600">Rs. {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600">{product.quantity}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(product)}
                    className="flex items-center space-x-1"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDeleteOpen(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </Button>
                </td>
              </>
            )}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Create Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Input
            label="Description"
            placeholder="Enter description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            error={errors.categoryId}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />

          <Input
            label="Price"
            type="number"
            placeholder="Enter price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
          />

          <Input
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />

          <div className="flex space-x-2 pt-4">
            <Button variant="primary" type="submit" className="flex-1">
              {selectedProduct ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
      />
      </div>
    </Layout>
  );
};
