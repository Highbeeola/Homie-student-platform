// components/Hero.tsx

import Image from 'next/image'; // We use the special Image component from Next.js for performance

export function Hero() {
    return (
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-t from-white/5 to-transparent p-6 shadow-2xl lg:flex-row lg:items-center">

            {/* Left side: Title and Search */}
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">
                    Find your trusted student home
                </h2>
                <p className="mt-2 text-[#bcdff0]">
                    Listings posted by graduating students — real photos, video tours, direct contact.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 items-center rounded-full border border-white/10 bg-white/5 p-1">
                        <input
                            placeholder="Search by area, title, etc..."
                            className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-400 outline-none"
                        />
                        <button className="rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8A6CFF] px-4 py-2 font-bold text-[#041322] shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side: Featured Card */}
            <aside className="w-full rounded-xl border border-white/10 bg-gradient-to-t from-white/5 to-transparent shadow-xl lg:w-72">
                <Image
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
                    alt="Featured property"
                    width={280}
                    height={160}
                    className="h-40 w-full rounded-t-xl object-cover"
                />
                <div className="p-3">
                    <h4 className="font-bold">Cozy 2BR near campus</h4>
                    <p className="mt-1 text-sm text-[#bcdff0]">5 min walk • generator & water</p>
                    <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-[#FF7A66] to-[#00d4ff] px-3 py-1 text-xs font-bold text-[#041322]">
                        Verified
                    </span>
                </div>
            </aside>

        </section>
    );
}