import Swal from "sweetalert2";

export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-danger",
    cancelButton: "btn btn-dark",
  },
  buttonsStyling: false,
})

export const swalOptimizeChartButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-warning",
    cancelButton: "btn btn-dark"
  },
  buttonsStyling: false,
})

export const swalTokenInvalid = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-danger"
  },
  buttonsStyling: false,
}
)