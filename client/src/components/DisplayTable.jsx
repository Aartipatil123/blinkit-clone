import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

const DisplayTable = ({ data, column }) => {

  // ✅ FIX: id add kiya
  const updatedColumns = [
    {
      id: "serialNumber",   // ✅ IMPORTANT FIX
      header: "Sr. No",
      cell: (info) => info.row.index + 1
    },
    ...(column || [])
  ]

  const table = useReactTable({
    data: data || [],
    columns: updatedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow">

      <table className="w-full border-collapse">

        {/* HEADER */}
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left text-sm font-bold text-gray-900 border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {
            table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3 text-sm font-medium text-gray-800 border-b"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={updatedColumns.length}
                  className="text-center p-5 text-gray-400"
                >
                  No Data Found
                </td>
              </tr>
            )
          }
        </tbody>

      </table>
    </div>
  )
}

export default DisplayTable