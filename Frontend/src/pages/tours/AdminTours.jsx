import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi'; // Fetch tours function
import axios from 'axios';
import ToursTable from '../../components/TourTable'; // Tours table component
import { useNavigate } from 'react-router-dom';

const AdminToursPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // For refreshing the query after deletion

  // Fetch tours
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });

  // Delete mutation
  const deleteTour = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tours/${id}`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalTours']); // Refetch tours after deletion
    },
  });

  // Handle delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteTour.mutate(id); // Trigger the mutation
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const TourData = data || [];
  console.log(TourData);

  return (
    <section className="full flex flex-col text-white font-bold">
      <div className="w-full flex justify-between">
        <h1 className="text-4xl">Tours</h1>
        <button
          className="py-2 px-6 bg-blue-500 rounded-md"
          onClick={() => navigate('/admin/create_tour')}
        >
          Create
        </button>
      </div>
      <div className="mt-[50px] flex w-full justify-between">
        <ToursTable data={TourData} onDelete={handleDelete} />
      </div>
    </section>
  );
};

export default AdminToursPage;
