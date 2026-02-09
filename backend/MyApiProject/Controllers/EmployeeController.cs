using Microsoft.AspNetCore.Mvc;
using MyApiProject.Business;
using MyApiProject.Models.DTOs;

namespace MyApiProject.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeBL _bl;

        public EmployeeController(EmployeeBL bl)
        {
            _bl = bl;
        }

        // -------------------------------------------------
        // GET (with optional filters)
        // api/employee/list?Id=1&Name=abc&Department=IT&Salary=5000
        // -------------------------------------------------
        [HttpGet("GetEmployeeList")]
        [ProducesResponseType(typeof(List<GetEmployeeDto>), StatusCodes.Status200OK)]
        public IActionResult GetEmployeeList([FromQuery] EmployeeFilterDto filter)
        {
            var employees = _bl.GetEmployees(filter);
            return Ok(employees);
        }

        // -------------------------------------------------
        // POST: api/employee/add
        // -------------------------------------------------
        [HttpPost("AddEmployee")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public IActionResult AddEmployee([FromBody] AddEmployeeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var newId = _bl.AddEmployee(dto);

                return CreatedAtAction(nameof(GetEmployeeList), new { id = newId }, new { Id = newId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // -------------------------------------------------
        // PUT: api/employee/update
        // -------------------------------------------------
        [HttpPut("UpdateEmployee")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult UpdateEmployee([FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _bl.UpdateEmployee(dto);

            return Ok("Employee updated successfully");
        }

        // -------------------------------------------------
        // DELETE: api/employee/delete
        // -------------------------------------------------
        [HttpDelete("DeleteEmployee")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult DeleteEmployee([FromBody] DeleteEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _bl.DeleteEmployee(dto);
            return Ok("Employee deleted successfully");
        }
    }
}
