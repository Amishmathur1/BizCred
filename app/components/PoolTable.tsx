import React from "react";

function PoolTable() {
  return (
    <div className="w-full">
      <table className="table-auto w-full">
        <tbody>
          {/* row 1 */}
          <tr className="bg-neutral-800 rounded-t-lg hover:bg-neutral-700 transition">
            <td className="py-4 px-6 rounded-tl-lg">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <img
                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white">Tech Innovators Inc.</div>
                  <div className="text-sm text-gray-400">New York, USA</div>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 text-white">
              Seeking funding to develop cutting-edge blockchain technology for secure financial transactions.
            </td>
            <td className="py-4 px-6 text-white">$5,000,000</td>
            <th className="py-4 px-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                Active
              </span>
            </th>
          </tr>
          {/* row 2 */}
          <tr className="bg-neutral-800 rounded-b-lg hover:bg-neutral-700 transition">
            <td className="py-4 px-6 rounded-bl-lg">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <img
                      src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white">EduFuture Foundation</div>
                  <div className="text-sm text-gray-400">San Francisco, USA</div>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 text-white">
              Funding needed to develop online education platforms for underprivileged students.
            </td>
            <td className="py-4 px-6 text-white">$2,800,000</td>
            <th className="py-4 px-6 rounded-br-lg">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
                Pending
              </span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PoolTable;
