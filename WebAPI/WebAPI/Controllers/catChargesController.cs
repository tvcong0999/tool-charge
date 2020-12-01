using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class catChargesController : ControllerBase
    {
        private readonly DataContext _context;

        public catChargesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/catCharges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<catCharge>>> GetcatCharge()
        {
            return await _context.catCharge.ToListAsync();
        }

        // GET: api/catCharges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<catCharge>> GetcatCharge(string id)
        {
            var test = id;
            var catCharge = await _context.catCharge.FindAsync(id);

            if (catCharge == null)
            {
                return NotFound();
            }

            return catCharge;
        }

        // PUT: api/catCharges/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutcatCharge(string id, catCharge catCharge)
        {
            if (id != catCharge.ID)
            {
                return BadRequest();
            }

            _context.Entry(catCharge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!catChargeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/catCharges
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<catCharge>> PostcatCharge(catCharge catCharge)
        {
            _context.catCharge.Add(catCharge);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (catChargeExists(catCharge.ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetcatCharge", new { id = catCharge.ID }, catCharge);
        }

        // DELETE: api/catCharges/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<catCharge>> DeletecatCharge(string id)
        {
            var catCharge = await _context.catCharge.FindAsync(id);
            if (catCharge == null)
            {
                return NotFound();
            }

            _context.catCharge.Remove(catCharge);
            await _context.SaveChangesAsync();

            return catCharge;
        }

        private bool catChargeExists(string id)
        {
            return _context.catCharge.Any(e => e.ID == id);
        }
    }
}
