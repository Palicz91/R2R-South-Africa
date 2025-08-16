import { useState, useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useBusiness } from '../context/BusinessContext';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

export default function BusinessSelector() {
  const navigate = useNavigate();
  const { selectedBusinessId, setSelectedBusinessId } = useBusiness();
  const role = useUserRole(); // returns 'admin' | 'user' | null initially
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Remove the original useEffect for loadBusinesses
  // useEffect(() => {
  //   loadBusinesses();
  // }, []);

  // Only call loadBusinesses when role is available
  useEffect(() => {
    if (role !== null) {
      loadBusinesses();
    }
  }, [role]);

  useEffect(() => {
    if (businesses.length > 0 && selectedBusinessId) {
      const business = businesses.find(b => b.id === selectedBusinessId);
      if (business) {
        setSelectedBusiness(business);
      }
    }
  }, [businesses, selectedBusinessId]);

  const loadBusinesses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('business_profiles').select('*');

      if (role !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedBusinesses = data?.map(b => ({
        id: b.id,
        business_name: b.business_name,
        logo_url: b.logo_url
      })) || [];

      setBusinesses(formattedBusinesses);

      // Get business from context or localStorage
      let effectiveId = selectedBusinessId || localStorage.getItem('selectedBusinessId');

      if (effectiveId) {
        // Check if the selected business exists in the user's businesses
        const matching = formattedBusinesses?.find(b => b.id === effectiveId);
        if (matching) {
          setSelectedBusiness(matching);
          setSelectedBusinessId(effectiveId);
        } else {
          // Clear the selected business if it doesn't belong to this user
          // or if it doesn't exist anymore
          localStorage.removeItem('selectedBusinessId');
          setSelectedBusiness(null);
          setSelectedBusinessId(null);
          
          // Select the first available business if any exist
          if (formattedBusinesses.length > 0) {
            const firstBusiness = formattedBusinesses[0];
            localStorage.setItem('selectedBusinessId', firstBusiness.id);
            setSelectedBusiness(firstBusiness);
            setSelectedBusinessId(firstBusiness.id);
          }
        }
      } 
      // If no selected business and we have businesses, select the first one
      else if (formattedBusinesses.length > 0) {
        effectiveId = formattedBusinesses[0].id;
        if (effectiveId) {
          localStorage.setItem('selectedBusinessId', effectiveId);
          setSelectedBusiness(formattedBusinesses[0]);
          setSelectedBusinessId(effectiveId);
        }
      }
    } catch (err) {
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSelect = (business: Business) => {
    // Only update if selecting a different business
    if (business.id !== selectedBusinessId) {
      // Update localStorage
      localStorage.setItem('selectedBusinessId', business.id);
      
      // Update state and context
      setSelectedBusiness(business);
      setSelectedBusinessId(business.id);
    }
    
    // Close dropdown in all cases
    setIsOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, business: Business) => {
    e.stopPropagation();
    setBusinessToDelete(business);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!businessToDelete) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('business_profiles')
        .delete()
        .eq('id', businessToDelete.id);
      
      if (error) throw error;
      
      // Update the businesses list
      setBusinesses(businesses.filter(b => b.id !== businessToDelete.id));
      
      // If we deleted the selected business, select another one
      if (businessToDelete.id === selectedBusinessId) {
        const remainingBusinesses = businesses.filter(b => b.id !== businessToDelete.id);
        if (remainingBusinesses.length > 0) {
          handleBusinessSelect(remainingBusinesses[0]);
        } else {
          setSelectedBusiness(null);
          setSelectedBusinessId(null);
          localStorage.removeItem('selectedBusinessId');
        }
      }
      
      setShowDeleteConfirm(false);
      setBusinessToDelete(null);
    } catch (err) {
      console.error('Error deleting business:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-10 w-52 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Optional label */}
      <p className="text-xs text-gray-500 mb-1 font-medium pl-1">Business Selector</p>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 w-full md:w-52 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedBusiness?.logo_url && (
            <img 
              src={selectedBusiness.logo_url} 
              alt={selectedBusiness.business_name} 
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="truncate text-sm font-medium text-gray-800">
            {selectedBusiness?.business_name || 'Select business'}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden p-3 w-[90vw] md:w-[24rem] max-w-full">
          {businesses.length > 0 ? (
            <>
              <div className="max-h-60 overflow-y-auto p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      className={`text-left p-3 flex flex-col items-center gap-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                        business.id === selectedBusiness?.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-gray-200'
                      }`}
                      onClick={() => handleBusinessSelect(business)}
                    >
                      <div className="w-full flex justify-end">
                        <button 
                          className="text-gray-400 hover:text-red-500 p-1"
                          onClick={(e) => handleDeleteClick(e, business)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.business_name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {business.business_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`text-sm truncate text-center w-full ${
                        business.id === selectedBusiness?.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}>
                        {business.business_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center mb-3">
              No businesses found
            </div>
          )}

          <button
            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold rounded-lg"
            onClick={() => {
              setIsOpen(false);
              navigate('/business/add');
            }}
          >
            + Add new business
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Business</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{businessToDelete?.business_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
