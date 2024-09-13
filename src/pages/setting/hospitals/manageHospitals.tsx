import { Actiontablehos, DelUserButton, HosTableImage, ManageHospitalsBody, ManageHospitalsContainer, ManageHospitalsHeader, ManageHospitalsHeaderAction, SubWardColumnFlex } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { hospitalsType } from "../../../types/hospital.type"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import { RiDeleteBin2Line } from "react-icons/ri"
import { useSelector } from "react-redux"
import { DataArrayStore, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { fetchHospitals } from "../../../stores/dataArraySlices"
import { wardsType } from "../../../types/ward.type"
import { responseType } from "../../../types/response.type"
import axios, { AxiosError } from "axios"
import DataTable, { TableColumn } from "react-data-table-component"
import Addhospitals from "./addhospitals"
import Swal from "sweetalert2"
import Addward from "./addward"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import { memo, useEffect } from "react"

export default function ManageHospitals() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { hospital } = useSelector<DeviceStateStore, DataArrayStore>((state) => state.arraySlice)
  const { hospitalsData } = hospital
  const { userLevel } = tokenDecode

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const deletehospital = async (hID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/hospital/${hID}`
    try {
      const response = await axios
        .delete<responseType<hospitalsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchHospitals(token))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  const deleteward = async (wID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/ward/${wID}`
    try {
      const response = await axios
        .delete<responseType<wardsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchHospitals(token))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  const columns: TableColumn<hospitalsType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('hosPicture'),
      cell: (item) => (
        <div>
          <HosTableImage
            src={item.hosPic ? `${import.meta.env.VITE_APP_IMG}${item.hosPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
            alt="hos-logo" />
        </div>
      ),
      center: true,
      sortable: false,
    },
    {
      name: t('hosName'),
      cell: (item) => item.hosName,
      center: true,
      sortable: false,
    },
    {
      name: t('hosAddress'),
      cell: (item) => item.hosAddress,
      center: true,
      sortable: false,
    },
    {
      name: t('hosTel'),
      cell: (item) => item.hosTelephone,
      center: true,
      sortable: false,
    },
    {
      name: t('action'),
      cell: (item, index) =>
        <Actiontablehos key={index}>
          <Addhospitals
            pagestate={'edit'}
            hosdata={{
              hosId: item.hosId,
              hosName: item.hosName,
              hosTelephone: item.hosTelephone,
              hosAddress: item.hosAddress,
              hosPic: item.hosPic
            }}
            key={item.hosId}
          />
          {
            item.hosId !== "HID-DEVELOPMENT" && userLevel !== '2' && userLevel !== '3' && <DelUserButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteHosTitle'),
                  text: t('notReverseText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deletehospital(item.hosId)
                  }
                })}>
              <RiDeleteBin2Line size={16} />
            </DelUserButton>
          }
        </Actiontablehos>,
      center: true,
      sortable: false,
    },
  ]

  const subWardColumns: TableColumn<wardsType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('wardName'),
      cell: (item) => item.wardName,
      center: true,
      sortable: false,
    },
    {
      name: t('action'),
      cell: (item, index) => (
        <Actiontablehos key={index}>
          <Addward
            key={item.wardId}
            pagestate={'edit'}
            warddata={{
              group_id: item.wardId,
              group_name: item.wardName,
              hospital: item.hospital
            }}
          />
          {item.hosId !== "HID-DEVELOPMENT" && (
            <DelUserButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteWardTitle'),
                  text: t('notReverseText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deleteward(item.wardId)
                  }
                })
            }>
              <RiDeleteBin2Line size={16} />
            </DelUserButton>
          )}
        </Actiontablehos>
      ),
      center: true,
      sortable: false,
    },
  ]

  const ExpandedComponent = memo(({ data }: { data: hospitalsType }) => (
    <SubWardColumnFlex>
      <DataTable
        columns={subWardColumns}
        data={data.ward}
        responsive
      />
    </SubWardColumnFlex>
  ))

  // Filter Data
  const filteredItems = hospitalsData.filter(item => item.hosName.includes(searchQuery) || item.hosTelephone.includes(searchQuery))

  return (
    <ManageHospitalsContainer>
      <ManageHospitalsHeader className="mb-3">
        <h3>{t('titleManageHosandWard')}</h3>
        <ManageHospitalsHeaderAction>
          {
            userLevel !== "3" && userLevel !== "2" &&
            <Addhospitals
              pagestate={'add'}
            />
          }
          <Addward
            pagestate={'add'}
          />
        </ManageHospitalsHeaderAction>
      </ManageHospitalsHeader>
      <ManageHospitalsBody>
        <DataTable
          columns={columns}
          data={filteredItems}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandedComponent}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
          pagination
          responsive
          fixedHeader
          fixedHeaderScrollHeight="calc(100dvh - 350px)"
        />
      </ManageHospitalsBody>
    </ManageHospitalsContainer>
  )
}
