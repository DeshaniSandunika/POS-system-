import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { Layout } from '../components/Layout';
import { showError, showSuccess } from '../utils/toast';
import { categoryService } from '../services/categoryService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.name && formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, formData);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.create(formData);
        showSuccess('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      showError(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    try {
      await categoryService.delete(selectedCategory.id);
      showSuccess('Category deleted successfully');
      setIsDeleteOpen(false);
      fetchCategories();
    } catch (error) {
      showError(error.message || 'Failed to delete category');
    }
  };

  if (loading && categories.length === 0) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Create First Category
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table
              headers={['Name', 'Description', 'Products', 'Actions']}
              data={categories}
              renderRow={(category) => (
                <>
                  <td className="border px-6 py-4 font-semibold text-gray-800">{category.name}</td>
                  <td className="border px-6 py-4 text-gray-600">{category.description || '-'}</td>
                  <td className="border px-6 py-4 text-gray-600">{category.products?.length || 0}</td>
                  <td className="border px-6 py-4 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(category)}
                      className="flex items-center space-x-1"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category);
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
          title={selectedCategory ? 'Edit Category' : 'Create Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name"
              placeholder="Enter category name"
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

            <div className="flex space-x-2 pt-4">
              <Button variant="primary" type="submit" className="flex-1">
                {selectedCategory ? 'Update' : 'Create'}
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
          title="Delete Category"
          message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        />
      </div>
    </Layout>
  );
};
