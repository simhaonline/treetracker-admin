import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import Group from '@material-ui/icons/Group'
import Edit from '@material-ui/icons/Edit'
import VpnKey from '@material-ui/icons/VpnKey'
import Help from '@material-ui/icons/Help'
import Delete from '@material-ui/icons/Delete'
import EmojiObjects from '@material-ui/icons/EmojiObjects'
import { withStyles } from '@material-ui/core/styles'
import Menu from './common/Menu'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import axios from 'axios'
import { AppContext } from './MainFrame'
import pwdGenerator from 'generate-password'
import dateformat from 'dateformat'

const style = (theme) => ({
  box: {
    height: '100%',
  },
  menu: {
    height: '100%',
  },
  rightBox: {
    height: '100%',
    padding: theme.spacing(8),
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  accountIcon: {
    fontSize: 67,
    marginRight: 11,
  },
  addUserBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUser: {
    color: 'white',
  },
  input: {
    margin: theme.spacing(0, 1, 4, 1),
  },
  firstName: {
    marginRight: theme.spacing(1),
  },
  lastName: {
    marginRight: theme.spacing(1),
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  noteBox: {
    backgroundColor: 'lightgray',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  copyIcon: {
    position: 'relative',
    bottom: 20,
  },
  copyMsg: {
    color: theme.palette.primary.main,
    position: 'relative',
    bottom: 5,
  },
  radioButton: {
    '&$radioChecked': { color: theme.palette.primary.main },
  },
  radioChecked: {},
  radioGroup: {
    position: 'relative',
    bottom: 12,
    left: 10,
  },
})

function not(a, b) {
  return a.filter((value) => b.every((bb) => bb.id !== value.id))
}

function intersection(a, b) {
  return a.filter((value) => b.some((bb) => bb.id === value.id))
}

const permissions = [
  {
    id: 0,
    name: 'admin',
  },
  {
    id: 1,
    name: 'Tree Auditor',
  },
]

function Users(props) {
  const { classes } = props
  const appContext = React.useContext(AppContext)
  const { user, token } = appContext
  //  const users = [
  //    {
  //      userName: 'dadiorchen',
  //      firstName: 'Dadior',
  //      lastName: 'Chen',
  //      email: 'dadiorchen@outlook.com',
  //      role: [
  //        {
  //          id: 0,
  //          name: 'admin',
  //        },
  //        {
  //          id: 1,
  //          name: 'Tree Auditor',
  //        },
  //      ],
  //    },
  //  ]
  const [userEditing, setUserEditing] = React.useState(undefined)
  const [userPassword, setUserPassword] = React.useState(undefined)
  const [userDelete, setUserDelete] = React.useState(undefined)
  const [newPassword, setNewPassword] = React.useState('')
  const [permissions, setPermissions] = React.useState([])
  const [isPermissionsShow, setPermissionsShown] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [copyMsg, setCopyMsg] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const passwordRef = React.useRef(null)

  async function load() {
    let res = await axios.get(`${process.env.REACT_APP_API_ROOT}/auth/permissions`, {
      headers: { Authorization: token },
    })
    if (res.status === 200) {
      setPermissions(res.data)
    } else {
      console.error('load fail:', res)
      return
    }
    res = await axios.get(`${process.env.REACT_APP_API_ROOT}/auth/admin_users`, {
      headers: { Authorization: token },
    })
    if (res.status === 200) {
      setUsers(res.data)
    } else {
      console.error('load fail:', res)
      return
    }
  }

  React.useEffect(() => {
    load()
  }, [])

  function handleEdit(user) {
    setUserEditing(user)
    setLeft(permissions.filter((p) => user.role.every((r) => r !== p.id)))
    setRight(permissions.filter((p) => user.role.some((r) => r === p.id)))
  }

  function handleDelete(user){
    setUserDelete(user)
  }

  async function handleDeleteConfirm(){
    if (userDelete.id == user.id){
      setErrorMessage('Cannot delete active user.')
      return
    }
    try {
      let res = await axios.delete(
        `${process.env.REACT_APP_API_ROOT}/auth/admin_users/${userDelete.id}`,
        {
          headers: { Authorization: token },
        }
      )
      if (res.status === 204) {
        setUserDelete(undefined)
        setErrorMessage('')
        load()
      } else {
        console.error('delete fail:', res)
        setErrorMessage('An error occured while deleting user. Please contact the system admin.')
        return
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('An error occured while deleting user. Please contact the system admin.')
    }
    
  }

  function handleDeleteCancel(){
    setUserDelete(undefined)
    setErrorMessage('')
  }

  function handlePasswordClose() {
    setUserPassword(undefined)
    setCopyMsg('')
  }

  function handleClose() {}

  const [checked, setChecked] = React.useState([])
  const [left, setLeft] = React.useState(permissions)
  const [right, setRight] = React.useState([])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((e) => e.id === value.id)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleAllRight = () => {
    setRight(right.concat(left))
    setLeft([])
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    setLeft(left.concat(right))
    setRight([])
  }
  const customList = (items) => (
    <Paper variant="outlined" className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`

          return (
            <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.findIndex((e) => e.id === value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.roleName} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Paper>
  )

  async function handleSave() {
    if (userEditing.userName === '' || right === undefined || right.length === 0) {
      setErrorMessage('Missing Field')
      return
    }
    //upload
    if (userEditing.id === undefined) {
      //add
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_API_ROOT}/auth/admin_users/`,
          {
            ...userEditing,
            role: right.map((e) => e.id),
          },
          {
            headers: { Authorization: token },
          }
        )
        if (res.status === 201) {
          setUserEditing(undefined)
          load()
        } else {
          console.error('load fail:', res)
          setErrorMessage('An error occured while creating user. Please contact the system admin.')
          return
        }
      } catch (e) {
        console.error(e)
        setErrorMessage('An error occured while creating user. Please contact the system admin.')
      }
    } else {
      try {
        let res = await axios.patch(
          `${process.env.REACT_APP_API_ROOT}/auth/admin_users/${userEditing.id}`,
          {
            ...userEditing,
            role: right.map((e) => e.id),
          },
          {
            headers: { Authorization: token },
          }
        )
        if (res.status === 200) {
          setUserEditing(undefined)
          load()
        } else {
          console.error('load fail:', res)
          setErrorMessage('An error occured while updating user. Please contact the system admin.')
          return
        }
      } catch (e) {
        console.error(e)
        setErrorMessage('An error occured while updating user. Please contact the system admin.')
      }
    }
  }

  function handleGeneratePassword(user) {
    //auto generate password before open password Modal
    let pwd = pwdGenerator.generate({
      length: 10,
      numbers: true /*generated pwd comprised of number, upper/lowercase */,
    })
    setNewPassword(pwd)
    setUserPassword(user)
  }

  async function handleGenerate() {
    //upload
    let res = await axios.put(
      `${process.env.REACT_APP_API_ROOT}/auth/admin_users/${userPassword.id}/password`,
      {
        password: newPassword,
      },
      {
        headers: { Authorization: token },
      }
    )
    if (res.status === 200) {
      setUserPassword(undefined)
      load()
    } else {
      console.error('load fail:', res)
      return
    }
  }

  function handlePermission() {
    setPermissionsShown(true)
  }

  function handleUsernameChange(e) {
    setUserEditing({ ...userEditing, userName: e.target.value })
  }

  function handleFirstNameChange(e) {
    setUserEditing({ ...userEditing, firstName: e.target.value })
  }

  function handleLastNameChange(e) {
    setUserEditing({ ...userEditing, lastName: e.target.value })
  }

  function handleEmailChange(e) {
    setUserEditing({ ...userEditing, email: e.target.value })
  }

  function handleActiveChange(e) {
    //convert to boolean
    let isTrueSet = e.target.value === 'true'
    setUserEditing({ ...userEditing, active: isTrueSet })
  }

  function handleAddUser() {
    setUserEditing({})
    setLeft(permissions)
  }

  function handleUserDetailClose() {
    setErrorMessage('')
    setRight([])
    setLeft(permissions)
    setChecked([])
    setUserEditing(undefined)
  }

  const handleCopy = () => {
    /*get the deep nested <input> tag from <TextField/> */
    passwordRef.current.childNodes[1].childNodes[0].select()
    document.execCommand('copy')
    setCopyMsg('Copied!')
  }

  return (
    <>
      <Grid container className={classes.box}>
        <Grid item xs={3}>
          <Paper elevation={3} className={classes.menu}>
            <Menu variant="plain" />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Grid container className={classes.rightBox}>
            <Grid item xs="12">
              <Grid container justify="space-between" className={classes.titleBox}>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <Group className={classes.accountIcon} />
                    </Grid>
                    <Grid item>
                      <Typography variant="h2">User Manager</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item className={classes.addUserBox}>
                  <Button
                    onClick={handleAddUser}
                    variant="contained"
                    className={classes.addUser}
                    color="primary"
                  >
                    ADD USER
                  </Button>
                </Grid>
              </Grid>
              <Grid container direction="column" className={classes.bodyBox}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>
                          <Grid container justfy="center" alignItems="center">
                            <Grid item>Role</Grid>
                            <Grid item>
                              <IconButton onClick={handlePermission} size="small">
                                <Help />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.userName} role="listitem">
                          <TableCell component="th" scope="row">
                            {user.userName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.active===true?'active':'inactive'}</TableCell>
                          <TableCell>
                            {user.role.map((r, i) => (
                              <Grid key={i}>
                                {
                                  permissions.reduce(
                                    (a, c) => a || (c.id === r ? c : undefined),
                                    undefined
                                  ).roleName
                                }
                              </Grid>
                            ))}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {dateformat(user.createdAt, 'm/d/yyyy h:MMtt')}
                          </TableCell>
                          <TableCell>
                            <IconButton title="edit" onClick={() => handleEdit(user)}>
                              <Edit />
                            </IconButton>
                            <IconButton title="delete" onClick={() => handleDelete(user)}>
                              <Delete />
                            </IconButton>
                            <IconButton
                              title="generate password"
                              onClick={() => handleGeneratePassword(user)}
                            >
                              <VpnKey />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={userEditing !== undefined}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">User Detail</DialogTitle>
        <DialogContent>
          <TextField
            required
            error={userEditing && userEditing.userName === ''}
            autoFocus
            id="userName"
            label="Username"
            type="text"
            variant="outlined"
            helperText={userEditing && userEditing.userName === '' ? 'Field is Required' : ''}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            disabled={userEditing && userEditing.id !== undefined ? true : false}
            value={(userEditing && userEditing.userName) || ''}
            className={classes.input}
            onChange={handleUsernameChange}
          />
          <Grid container>
            <Grid item className={classes.firstName}>
              <TextField
                autoFocus
                id="firstName"
                label="First Name"
                type="text"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={(userEditing && userEditing.firstName) || ''}
                className={classes.input}
                onChange={handleFirstNameChange}
              />
            </Grid>
            <Grid item className={classes.lastName}>
              <TextField
                autoFocus
                id="lastName"
                label="Last Name"
                type="text"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={(userEditing && userEditing.lastName) || ''}
                className={classes.input}
                onChange={handleLastNameChange}
              />
            </Grid>
          </Grid>
          <TextField
            autoFocus
            id="email"
            label="Email"
            type="text"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={(userEditing && userEditing.email) || ''}
            className={classes.input}
            onChange={handleEmailChange}
          />
          <FormControl component="fieldset" className={classes.formControl}>
            <Grid container>
              <Grid item>
                <FormLabel component="legend">Active:</FormLabel>
              </Grid>
              <Grid item>
                <RadioGroup
                  aria-label="active-state"
                  name="active-state"
                  className={classes.radioGroup}
                  value={(userEditing && userEditing.active) || ''}
                  onChange={handleActiveChange}
                >
                  <Grid container>
                    <Grid item>
                      <FormControlLabel
                        value="true"
                        control={
                          <Radio
                            classes={{ root: classes.radioButton, checked: classes.radioChecked }}
                          />
                        }
                        label="Active"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        value="false"
                        control={
                          <Radio
                            classes={{ root: classes.radioButton, checked: classes.radioChecked }}
                          />
                        }
                        label="Inactive"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
            </Grid>
          </FormControl>
          {userEditing && userEditing.createdAt && (
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="outline">Created</Typography>
              </Grid>
              <Grid item>
                <Typography variant="outline">
                  {userEditing && dateformat(userEditing.createdAt, 'm/d/yyyy h:MMtt')}
                </Typography>
              </Grid>
            </Grid>
          )}
          <FormControl error={right.length === 0}>
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item role="list">
                <FormLabel variant="outline">Roles</FormLabel>
                {/* <Typography variant="outline">Roles</Typography> */}
                {customList(left)}
              </Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleAllRight}
                    disabled={left.length === 0}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleAllLeft}
                    disabled={right.length === 0}
                    aria-label="move all left"
                  >
                    ≪
                  </Button>
                </Grid>
              </Grid>
              <Grid item role="list">
                <FormLabel variant="outline">Selected</FormLabel>
                {/* <Typography variant="outline">Selected</Typography> */}
                {customList(right)}
              </Grid>
            </Grid>
            {right.length === 0 && (
              <FormHelperText>At Least One Role Must be Selected</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Typography variant="subtitle2" color="error">
            {errorMessage}
          </Typography>
          <Button onClick={handleUserDetailClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={userPassword !== undefined}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Generate Password</DialogTitle>
        <DialogContent>
          {/*
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        */}
          <Grid container className={classes.noteBox}>
            <Grid item xs="1">
              <EmojiObjects />
            </Grid>
            <Grid item xs="11">
              <Typography className={classes.note}>
                Please be careful, once you generate a new password, then the current password for
                this user will be dedicated.
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" wrap="nowrap">
            <Grid item>
              <TextField
                autoFocus
                id="newPassword"
                label="Please input new password"
                type="text"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                ref={passwordRef}
                className={classes.input}
                helperText="We automatically generated a password for you, if you don't like it, you can put a new one by yourself."
              />
            </Grid>
            {document.queryCommandSupported('copy') && (
              <Grid item>
                <IconButton
                  title="copy"
                  aria-label="copy"
                  className={classes.copyIcon}
                  onClick={handleCopy}
                >
                  <FileCopyIcon />
                </IconButton>
                <Typography className={classes.copyMsg}>{copyMsg}</Typography>
              </Grid>
            )}
          </Grid>
          <Box height={20} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordClose}>Cancel</Button>
          <Button onClick={handleGenerate} variant="contained" color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={userDelete !== undefined}
        onClose={handleDeleteCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <Grid item xs="11">
            <Typography className={classes.note}>
              {`Are you sure you want to delete user \
              ${(userDelete && userDelete.userName) || ''}?`}
            </Typography>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Typography color="error">
            {errorMessage}
          </Typography>
          <Button onClick={handleDeleteCancel} variant="contained" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isPermissionsShow} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Roles Description</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell component="th" scope="row">
                      <Typography>{p.roleName}</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography>{p.description}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsShown(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default withStyles(style)(Users)
