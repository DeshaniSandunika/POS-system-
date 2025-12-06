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
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { Eye, Trash2, Plus, X } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({ productId: '', quantity: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!formData.productId || !formData.quantity) {
      showError('Please select product and quantity');
      return;
    }

    const product = products.find((p) => p.id === formData.productId);
    if (!product) return;

    const existingItem = orderItems.find((item) => item.productId === formData.productId);
    if (existingItem) {
      existingItem.quantity += parseInt(formData.quantity);
    } else {
      orderItems.push({
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        product,
      });
    }

    setOrderItems([...orderItems]);
    setFormData({ productId: '', quantity: '' });
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      showError('Please add at least one item');
      return;
    }

    try {
      const items = orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await orderService.create({ items });
      showSuccess('Order created successfully');
      setIsModalOpen(false);
      setOrderItems([]);
      fetchData();
    } catch (error) {
      showError(error.message || 'Failed to create order');
    }
  };

  const handleDelete = async () => {
    try {
      await orderService.delete(selectedOrder.id);
      showSuccess('Order deleted successfully');
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      showError(error.message || 'Failed to delete order');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  if (loading && orders.length === 0) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <Button
          variant="primary"
          onClick={() => {
            setOrderItems([]);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Order</span>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No orders found</p>
          <Button
            variant="primary"
            onClick={() => {
              setOrderItems([]);
              setIsModalOpen(true);
            }}
          >
            Create First Order
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            headers={['Order #', 'Date', 'Total Amount', 'Status', 'Items', 'Actions']}
            data={orders}
            renderRow={(order) => (
              <>
                <td className="border px-6 py-4 font-semibold text-gray-800">{order.orderNumber}</td>
                <td className="border px-6 py-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-6 py-4 font-semibold text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="border px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border px-6 py-4 text-gray-600">{order.items?.length || 0}</td>
                <td className="border px-6 py-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsViewOpen(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
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

      {/* Create Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOrderItems([]);
        }}
        title="Create New Order"
      >
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Add Items</h3>
            <div className="space-y-3">
              <Select
                label="Product"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                options={products.map((p) => ({
                  value: p.id,
                  label: `${p.name} - $${p.price.toFixed(2)} (${p.quantity} in stock)`,
                }))}
              />

              <Input
                label="Quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />

              <Button variant="secondary" onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </div>

          {/* Order Items List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Order Items ({orderItems.length})</h3>
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items added yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.product.price.toFixed(2)} = $
                        {(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          {orderItems.length > 0 && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="primary"
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0}
              className="flex-1"
            >
              Create Order
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setOrderItems([]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Order Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={`Order ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order Number</p>
                <p className="font-semibold">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-semibold">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold">{selectedOrder.status}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="font-semibold text-green-600">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="secondary" onClick={() => setIsViewOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order "${selectedOrder?.orderNumber}"? This action cannot be undone.`}
      />
      </div>
    </Layout>
  );
};
