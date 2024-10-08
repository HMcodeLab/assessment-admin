import React from 'react'

const ProtectingScore = ({ProctoringScore}) => {
  return (
    <fieldset className="flex flex-col gap-2 border border-red-500 p-4 mx-auto font-semibold">
    <legend className="text-center font-semibold text-red-500 px-2 text-xl uppercase">
      Proctoring Score
    </legend>
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Proctoring Criteria
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Score
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Microphone</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.mic}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Web Camera</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.webcam}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Tab Switching</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.TabSwitch}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Multiple Person In A Frame</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.multiplePersonInFrame}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Phone In a Frame</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.PhoneinFrame}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Invisible Camera</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.invisiblecam}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">Control key Pressed</td>
          <td className="px-6 py-4 whitespace-nowrap text-red-500">
            {ProctoringScore?.ControlKeyPressed || 0}
          </td>
        </tr>

      </tbody>
    </table>
  </fieldset>
  )
}

export default ProtectingScore