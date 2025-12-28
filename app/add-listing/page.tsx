// app/add-listing/page.tsx
import { Header } from '@/components/Header';
import { ListingForm } from '@/components/ListingForm'; // Import our new reusable component

export default function AddListingPage() {
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Header />
        <div className="mx-auto mt-12 max-w-2xl">
          {/* We use the form in "Create" mode by not passing a prop */}
          <ListingForm />
        </div>
      </div>
    </div>
  );
}