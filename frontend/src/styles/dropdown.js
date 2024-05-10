export const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: 'transparent',
        borderColor: 'transparent',
        borderBottom: '2px solid', // Only bottom border
        borderBottomColor: state.isFocused ? '#ff9800' : '#ff9800',
        borderRadius: '0', // No rounded corners on the sides
        borderWidth: '0 0 2px 0', // No border except bottom
        boxShadow: 'none',
        color: '#ff9800',
        display: 'flex',
        justifyContent: 'center',
    }),

  menu: (base) => ({
    ...base,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Preserving the semi-transparent background
    backdropFilter: "blur(7px)", // Apply a blur effect
    color: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#00e676',
    textAlign: 'center', // Ensures text within the control is centered
}),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'white',
    ':hover': {
      backgroundColor: 'red',
      color: 'black',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: '#00e676',
    textAlign: 'center', // Centers the placeholder text
}),

};