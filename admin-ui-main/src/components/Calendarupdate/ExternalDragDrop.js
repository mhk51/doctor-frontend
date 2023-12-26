
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ResourcesDirective, ResourceDirective,ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { extend, closest, remove, addClass } from '@syncfusion/ej2-base';
import "./external-drag-drop.scss";
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import  dataSource from '../Calendar/dataSource.json';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import  { useState } from 'react';
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import NewPatient from "./newpatient";
import {
 
  Internationalization,
  isNullOrUndefined,
 
} from "@syncfusion/ej2-base";
import API_BASE_URL from '../../config/config';
  
import Axios from "axios";


/**
 * schedule resources group-editing sample
 */
const ExternalDragDrop = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const [modal, setModal] = useState(false);
  // ID START END
    let scheduleObj = useRef(null);
    //WAITING
    let treeObj = useRef(null);
    let isTreeItemDropped = false;
    //COLOR CODING (CLINIC)
    let eventTypeObj = useRef(null);
    //title
    let titleObj = useRef(null);
    let notesObj = useRef(null);
    let cheifObj=useRef(null);
    let typeObj=useRef(null); 
    let virtualObj=useRef(null);
    let draggedItemId = '';
    const allowDragAndDrops = true;
    const fields = { dataSource: dataSource.waitingList, id: 'Id', text: 'Name' };
    const data = extend([], dataSource.hospitalData, null, true);
    const intl = new Internationalization();
  
    const social = [
      { Name: "Zoom", Id: 1, Capacity: 20, Type: "Conference" },
      {
        Name: "Teams",
        Id: 5,
        Capacity: 25,
        Color: "#fec200",
        Type: "Conference",
      },
      { Name: "Meet", Id: 6, Capacity: 10, Color: "#00bdae", Type: "Cabin" },
      {
        Name: "WhatsApp Video",
        Id: 6,
        Capacity: 10,
        Color: "#00bdae",
        Type: "Cabin",
      },
      {
        Name: "WhatsApp Call",
        Id: 6,
        Capacity: 10,
        Color: "#00bdae",
        Type: "Cabin",
      },
      
    ];
  

  
    const temp = [
      {
        Name: "temp1",
        Id: 1,
        Capacity: 20,
        Color: "#ea7a57",
        Type: "Conference",
      },
      {
        Name: "temp2",
        Id: 5,
        Capacity: 25,
        Color: "#fec200",
        Type: "Conference",
      },
      { Name: "temp3", Id: 6, Capacity: 10, Color: "#00bdae", Type: "Cabin" },
    ];
    const getResourceData = (data) => {
      const resources = scheduleObj.current.getResourceCollections().slice(-1)[0];
      const resourceData = resources.dataSource.filter(
        (resource) => resource.Id === data.RoomId
      )[0];
      return resourceData;
    };
    const getHeaderStyles = (data) => {
      if (data.elementType === "cell") {
        return { alignItems: "center", color: "#919191" };
      } else {
        const resourceData = getResourceData(data);
        return { background: resourceData.Color, color: "#FFFFFF" };
      }
    };
    //newpatient popup
    
    const getHeaderTitle = (data) => {
      return data.elementType === "cell"
        ? "Registered Patient"
        : "Appointment Details";
    };
  
    const getHeaderDetails = (data) => {
      return (
        intl.formatDate(data.StartTime, { type: "date", skeleton: "full" }) +
        " (" +
        intl.formatDate(data.StartTime, { skeleton: "hm" }) +
        " - " +
        intl.formatDate(data.EndTime, { skeleton: "hm" }) +
        ")"
      );
    };
    const [patients, setPatients] = useState([]); // State to store the list of patients

    // Fetch the list of patients when the component mounts
    useEffect(() => {
      Axios.get(`${API_BASE_URL}/patients/`)
        .then((response) => {
          setPatients(response.data);
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
        });
    }, []);


    const [clinics, setClinics] = useState([]); // State to store the list of patients

    // Fetch the list of patients when the component mounts
    useEffect(() => {
      Axios.get(`${API_BASE_URL}/clinic/`)
        .then((response) => {
          setClinics(response.data);
        })
        .catch((error) => {
          console.error('Error fetching clinics:', error);
        });
    }, []);

    const [virtualmeet, setVirtualMeet] = useState([]); // State to store the list of patients

    // Fetch the list of patients when the component mounts
    useEffect(() => {
      Axios.get(`${API_BASE_URL}/virtualmeet/`)
        .then((response) => {
          setVirtualMeet(response.data);
        })
        .catch((error) => {
          console.error('Error fetching clinics:', error);
        });
    }, []);

    const getEventType = (data) => {
      return getResourceData(data).Name;
    };

    const createAppointment = async (newAppointment) => {
      try {
          const response = await Axios.post(`${API_BASE_URL}/appointment/`, newAppointment); // Replace with your Django API endpoint
          return response.data;
      } catch (error) {
          console.error('Error creating appointment:', error);
          throw error;
      }
  };
  const addPatient = async (newPatient) => {
    try {
        const response = await Axios.post(`${API_BASE_URL}/patients/`, newPatient); // Replace with your Django API endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
};
  // Function to fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/appointment/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };

  const getPatientNameById = (patientId) => {
  const patient = patients.find((p) => p.id === patientId);
  return patient ? patient.full_name_phone : '';
};

  useEffect(() => {
    // Fetch appointments from the backend when the component mounts
    fetchAppointments()
      .then((appointments) => {
        // Update the Scheduler with the fetched appointments
        const newAppointments = appointments.map((appointment) => ({
          Id: appointment.idappointment,
          Name: getPatientNameById(appointment.patient),
          StartTime: new Date(appointment.startdate),
          EndTime: new Date(appointment.end_date),
          Description: appointment.notes,
          RoomId: appointment.clinic,
          Chief:appointment.chief,
          Type: appointment.type,
          Virtual: appointment.online,
          // Other appointment fields...
        }));
        // Add the fetched appointments to the Scheduler
        scheduleObj.current.addEvent(newAppointments);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

    const buttonClickActions = (e) => {
      const quickPopup = closest(e.target, ".e-quick-popup-wrapper");
      const getSlotData = () => {
        const addObj = {};
        addObj.Id = scheduleObj.current.getEventMaxID();
       //title patient name
        addObj.Subject = isNullOrUndefined(titleObj.current.value)
          ? "Add title"
          : titleObj.current.value;
        addObj.StartTime = new Date(
          scheduleObj.current.activeCellsData.startTime
        );
        addObj.EndTime = new Date(scheduleObj.current.activeCellsData.endTime);
        addObj.IsAllDay = scheduleObj.current.activeCellsData.isAllDay;
        //notes
        addObj.Description = isNullOrUndefined(notesObj.current.value)
          ? "Add notes"
          : notesObj.current.value;
          //clinic id
        addObj.RoomId = eventTypeObj.current.value;
        addObj.Chief=cheifObj.current.value;
        addObj.Type=typeObj.current.value;
        addObj.Virtual=virtualObj.current.value;
        return addObj;
      };
  
      if (e.target.id === "add") {
        const addObj = getSlotData();
        const newAppointment = {
          idappointment: addObj.Id,
          patient: addObj.Subject, // You may need to adjust this based on your data structure
          startdate: addObj.StartTime,
          end_date: addObj.EndTime,
          notes: addObj.Description,
          clinic:addObj.RoomId,
          chief:addObj.Chief,
          type: addObj.Type,
          online:addObj.Virtual,
          // Other appointment fields...
      };
      createAppointment(newAppointment).then((createdAppointment) => {
        // Add the new appointment to the schedule
        scheduleObj.current.addEvent(addObj);
      });
      }
      else if(e.target.id === "addnew") {
        const addObj = getSlotData();
        const newPatient={
            first_name:addObj.first_name,
            last_name:addObj.last_name,
            phone:addObj.phone,
        }
        const newAppointment = {
          idappointment: addObj.Id,
          
          startdate: addObj.StartTime,
          end_date: addObj.EndTime,
          notes: addObj.Description,
          clinic:addObj.RoomId,
          chief:addObj.Chief,
          type: addObj.Type,
          online:addObj.Virtual,
          // Other appointment fields...
      };
      addPatient(newPatient).then((addedPatient)=> {
        newAppointment.patient=addedPatient.id;
    });
      createAppointment(newAppointment).then((createdAppointment) => {
        // Add the new appointment to the schedule
        scheduleObj.current.addEvent(addObj);
      });
      }
      else if (e.target.id === "delete") {
        const eventDetails = scheduleObj.current.activeEventData.event;
        let currentAction = "Delete";
        if (eventDetails.RecurrenceRule) {
          currentAction = "DeleteOccurrence";
        }
        scheduleObj.current.deleteEvent(eventDetails, currentAction);
      } else if (e.target.id === "new") {
        const addObj = getSlotData();
        scheduleObj.current.addEvent(addObj);
    }
       
        
        
       else {
        const isCellPopup =
          quickPopup.firstElementChild.classList.contains("e-cell-popup");
        const eventDetails = isCellPopup
          ? getSlotData()
          : scheduleObj.current.activeEventData.event;
        let currentAction = isCellPopup ? "Add" : "Save";
        if (eventDetails.RecurrenceRule) {
          currentAction = "EditOccurrence";
        }
        scheduleObj.current.openEditor(eventDetails, currentAction, true);
      }
      scheduleObj.current.closeQuickInfoPopup();
    };
  
    const onPopupOpen = (args) => {
      if (
        args.target &&
        !args.target.classList.contains("e-appointment") &&
        !isNullOrUndefined(titleObj) &&
        !isNullOrUndefined(titleObj.current)
      ) {
        titleObj.current.focusIn();
      }
    };





    
    //register
    const headerTemplate = (props) => {
      return (
        <div className="quick-info-header">
          <div
            className="quick-info-header-content"
            style={getHeaderStyles(props)}
          >
            <div className="quick-info-title">{getHeaderTitle(props)}</div>
            <div className="duration-text">{getHeaderDetails(props)}</div>
          </div>
        </div>
      );
    };
  
    const contentTemplate = (props) => {
      return (
        <div className="quick-info-content">
          {props.elementType === "cell" ? (
            <div className="e-cell-content">
              <div className="content-area">
                <DropDownListComponent
                  id="title"
                  ref={titleObj}
                  dataSource={patients}
                  fields={{ text: "full_name_phone" , value: "id" }}
                  placeholder="Choose patient"
             
                />
              </div>
  
              <div className="content-area">
                <TextBoxComponent
                  id="chief"
                  ref={cheifObj}
                  placeholder="Chief Complaint"
                  style={{marginTop:"10px"}}
                />
  
                <h3 style={{ marginTop: "0.5rem" , fontSize:"12px",color:"black"}}>Appointment Details</h3>
                <h4 style={{ marginTop: "0.8rem",fontSize:"10px",color:"black"}}>FROM &nbsp;:</h4>
                <DateTimePickerComponent
                  id="StartTime"
                  data-name="StartTime"
                  value={new Date(props.StartTime || new Date())}
                />
                <h4 style={{ fontSize:"12px",color:"black"}}>TO&nbsp;:</h4>
                <DateTimePickerComponent
                  id="EndTime"
                  data-name="EndTime"
                  value={new Date(props.EndTime || new Date())}
                />
                <DropDownListComponent
                  id="eventType"
                  ref={eventTypeObj}
                  dataSource={clinics}
                  fields={{ text: "name", value: "id" }}
                  placeholder="Assigned Clinic"
                  style={{marginTop:"10px"}}
                  popupHeight="200px"
                />
                <TextBoxComponent
                  id="Type"
                  ref={typeObj}
                  placeholder="Procedure Type"
                  style={{marginTop:"10px"}}
                />
              </div>
              <div className="content-area">
                <h3 style={{ fontSize:"12px",color:"black"}}>Appointment Type</h3>
                <DropDownListComponent
                  id="online"
                  ref={virtualObj}
                  dataSource={virtualmeet}
                  fields={{ text: "platform", value: "id" }}
                  placeholder="Platform"
                  style={{ marginTop: "10px" }}
                  popupHeight="200px"
                />
                <TextBoxComponent
                  id="notes"
                  ref={notesObj}
                  placeholder="Additional Notes"
                  style={{ marginTop: "15px" }}
                />
              </div>
            </div>
          ) : (
            <div className="event-content">
              <div className="meeting-type-wrap">
                <label>Patient</label>:<span>{props.Subject}</span>
              </div>
              <div className="meeting-subject-wrap">
                <label>Clinic</label>:<span>{getEventType(props)}</span>
              </div>
              <div className="notes-wrap">
                <label>Additional Notes</label>:<span>{props.Description}</span>
              </div>
              
            </div>
          )}
        </div>
      );
    };
  
    //NEW PATIENT POPUP
const NewPatient = ({ isOpen, onClose,props }) => {
  // State for managing the form data

  // Function to handle changes in form fields
  if (!isOpen) return null;
  return (
<div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
<div className="new-patient">
<div className="content">
<div className="top">
<h2>Add a new patient</h2>  
        <div className="quick-info-content">
            <div className="e-cell-content">
              <div className="content-area">
                <TextBoxComponent
                  id="title"
                  ref={titleObj}
                  placeholder="Enter patient full name"
             
                />
              </div>
  
              <div className="content-area">
                <TextBoxComponent
                  id="chief"
                  ref={cheifObj}
                  placeholder="Chief complaint"
                  style={{marginTop:"10px"}}
                />
  
                <h3 style={{ marginTop: "0.5rem" , fontSize:"12px",color:"black"}}>Appointment Details</h3>
                <h4 style={{ marginTop: "0.8rem",fontSize:"10px",color:"black"}}>FROM &nbsp;:</h4>
                
                <DropDownListComponent
                  id="eventType"
                  ref={eventTypeObj}
                  dataSource={clinics}
                  fields={{ text: "name", value: "id" }}
                  placeholder="Assigned Clinic"
                  style={{marginTop:"10px"}}
                  popupHeight="200px"
                />
                <TextBoxComponent
                  id="type"
                  ref={typeObj}
                  placeholder="Procedure Type"
                  style={{marginTop:"10px"}}
                  
                />
              </div>
              <div className="content-area">
                <h3 style={{ fontSize:"12px",color:"black"}}>Appointment Type</h3>
                <DropDownListComponent
                  id="eventType"
                  ref={eventTypeObj}
                  dataSource={virtualmeet}
                  fields={{ text: "platform", value: "id" }}
                  placeholder="Type"
                  style={{ marginTop: "10px" }}
                  popupHeight="200px"
                />
                <TextBoxComponent
                  id="notes"
                  ref={notesObj}
                  placeholder="Additional Notes"
                  style={{ marginTop: "15px" }}
                />
              </div></div>
           
            </div>
          
            <ButtonComponent
                id="add"
                cssClass="e-flat"
                content="Book"
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
          <button className="close" onClick={onClose}>
          Close
</button>
 

</div></div>
</div>
    </div>
  );
};

 

    const footerTemplate = (props) => {
      return (
        <div className="quick-info-footer">
          {props.elementType == "cell" ? (
            <div className="cell-footer">
              <ButtonComponent
                id="new"
                cssClass="e-flat"
                content="New Patients"
                onClick={openPopup}
              />
              <ButtonComponent
                id="addnew"
                cssClass="e-flat"
                content="Book"
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
            </div>
          ) : (
            <center>
            <div className="event-footer">
             <ButtonComponent
                id="#"
                cssClass="e-flat"
                content="Access EMR"
               
              />
              <ButtonComponent
                id="more"
                cssClass="e-flat"
                content="Edit"
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
              <ButtonComponent
                id="delete"
                cssClass="e-flat"
                content="Delete"
                onClick={buttonClickActions.bind(this)}
              />
  
              
               
            </div></center>
          )}
        </div>
      );
    };
    
  




  //WAITING LIST
    const treeTemplate = (props) => {
        return (<div id="waiting">
        <div id="waitdetails">
          <div id="waitlist">{props.Name}</div>
          <div id="waitcategory">{props.DepartmentName} - {props.Description}</div>
        </div>
      </div>);
    };
    const onItemSelecting = (args) => {
        args.cancel = true;
    };
    const onTreeDrag = (event) => {
        if (scheduleObj.current.isAdaptive) {
            let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
            if (classElement) {
                classElement.classList.remove('e-device-hover');
            }
            if (event.target.classList.contains('e-work-cells')) {
                addClass([event.target], 'e-device-hover');
            }
        }
    };
    const onActionBegin = (event) => {
        if (event.requestType === 'eventCreate' && isTreeItemDropped) {
            let treeViewData = treeObj.current.fields.dataSource;
            const filteredPeople = treeViewData.filter((item) => item.Id !== parseInt(draggedItemId, 10));
            treeObj.current.fields.dataSource = filteredPeople;
            let elements = document.querySelectorAll('.e-drag-item.treeview-external-drag');
            for (let i = 0; i < elements.length; i++) {
                remove(elements[i]);
            }
        }
    };
    const onTreeDragStop = (event) => {
        let treeElement = closest(event.target, '.e-treeview');
        let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
        if (classElement) {
            classElement.classList.remove('e-device-hover');
        }
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement = closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData = treeObj.current.fields.dataSource;
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData = treeviewData.filter((item) => item.Id === parseInt(event.draggedNodeData.id, 10));
                    let cellData = scheduleObj.current.getCellDetails(event.target);
                    let resourceDetails = scheduleObj.current.getResourcesByIndex(cellData.groupIndex);
                    let eventData = {
                        Name: filteredData[0].Name,
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: cellData.isAllDay,
                        Description: filteredData[0].Description
                        
                    };
                    scheduleObj.current.openEditor(eventData, 'Add', true);
                    isTreeItemDropped = true;
                    draggedItemId = event.draggedNodeData.id;
                }
            }
        }
        document.body.classList.remove('e-disble-not-allowed');
    };
    const onTreeDragStart = () => {
        document.body.classList.add('e-disble-not-allowed');
    };
    return (
    <div className='schedule-control-section'>
      <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
        <div className="control-wrapper drag-sample-wrapper">
          <div className="schedule-container">
            
            <ScheduleComponent
              ref={scheduleObj}
              cssClass="schedule-drag-drop"
              width="100%"
              height="650px"
              selectedDate={new Date(2021, 7, 2)}
              currentView="Day" 
              eventSettings={{
                dataSource: data,
                fields: {
                  subject: { title: 'Patient Name', name: 'Name' },
                  startTime: { title: 'From', name: 'StartTime' },
                  endTime: { title: 'To', name: 'EndTime' },
                  description: { title: 'Reason', name: 'Description' },
                },
              }}
              group={{
                enableCompactView: true,
              
              }}
              
              actionBegin={onActionBegin}
           
           
           
              quickInfoTemplates={{ header: headerTemplate.bind(this), 
                content: contentTemplate.bind(this), footer: footerTemplate.bind(this) }} popupOpen={onPopupOpen.bind(this)}
           
           
           
           >
              <ResourcesDirective>
             <ResourceDirective field='RoomId' title='Room Type' name='MeetingRoom' textField='Name' idField='Id' colorField='Color' dataSource={clinics}></ResourceDirective>
               
              </ResourcesDirective>
              <ViewsDirective>
              <ViewDirective option='Day'/>
              <ViewDirective option='Week'/>
              <ViewDirective option='WorkWeek'/>
              <ViewDirective option='Month'/>
              <ViewDirective option='Agenda'/>
            </ViewsDirective>
              <Inject services={[Day, Week, Agenda,Month,WorkWeek, Resize, DragAndDrop]} />
            </ScheduleComponent>
          </div>
          <div className="treeview-container">
            <div className="title-container">
              <h1 className="title-text">Waiting List</h1>
            </div>
            <TreeViewComponent
              ref={treeObj}
              cssClass="treeview-external-drag"
              dragArea=".drag-sample-wrapper"
              nodeTemplate={treeTemplate}
              fields={fields}
              nodeDragStop={onTreeDragStop}
              nodeSelecting={onItemSelecting}
              nodeDragging={onTreeDrag}
              nodeDragStart={onTreeDragStart}
              allowDragAndDrop={allowDragAndDrops}
            />
          </div>
        </div>
      </div>
      
      
      
      
    </div>
    
    <NewPatient isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};
export default ExternalDragDrop;

