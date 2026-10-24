
"use client";

import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Team Member";
}

const TeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  
useEffect(() => {
  let cancelled = false;

  const loadMembers = async () => {
    try {
      const savedMembers = await Promise.resolve(
        localStorage.getItem("devflowTeamMembers"),
      );

      if (savedMembers) {
        const parsedMembers: unknown = JSON.parse(savedMembers);

        if (
          Array.isArray(parsedMembers) &&
          parsedMembers.every(
            (member) =>
              member &&
              typeof member.id === "string" &&
              typeof member.name === "string" &&
              typeof member.email === "string" &&
              (member.role === "Administrator" ||
                member.role === "Team Member"),
          )
        ) {
          if (!cancelled) {
            setMembers(parsedMembers as TeamMember[]);
          }
        }
      }
    } catch {
      console.error("Could not load saved team members.");
    } finally {
      if (!cancelled) {
        setIsLoaded(true);
      }
    }
  };

  void loadMembers();

  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("devflowTeamMembers", JSON.stringify(members));
  }
}, [members, isLoaded]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Team Member");

  
const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!name.trim() || !email.trim()) {
    return;
  }

  if (editingMemberId) {
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === editingMemberId
          ? {
              ...member,
              name: name.trim(),
              email: email.trim(),
              role,
            }
          : member,
      ),
    );
  } else {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      role,
    };

    setMembers((currentMembers) => [...currentMembers, newMember]);
  }

  setName("");
  setEmail("");
  setRole("Team Member");
  setEditingMemberId(null);
  setIsFormOpen(false);
};
  const administrators = members.filter(
    (member) => member.role === "Administrator",
  ).length;

  const teamMembers = members.filter(
    (member) => member.role === "Team Member",
  ).length;


const handleRemoveMember = (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to remove this team member?",
  );

  if (!confirmed) return;

  setMembers((currentMembers) =>
    currentMembers.filter((member) => member.id !== id),
  );
};


const handleEditMember = (member: TeamMember) => {
  setEditingMemberId(member.id);
  setName(member.name);
  setEmail(member.email);
  setRole(member.role);
  setIsFormOpen(true);
};

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your team members and their roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          + Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Total Members", count: members.length, description: "People in your team" },
          { title: "Administrators", count: administrators, description: "Members with admin roles" },
          { title: "Team Members", count: teamMembers, description: "Standard member accounts" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stat.count}
            </p>
            <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage the people working with you.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
              👥
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No team members yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add your first team member to start organizing your team and
              assigning roles.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Add Your First Member
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{member.name}</p>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {member.email}
                  </p>
                </div>
                
              
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {member.role}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleEditMember(member)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
            className="my-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="add-member-title"
                className="text-xl font-semibold text-slate-900"
              >
                {editingMemberId ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                type="button"
                aria-label="Close form"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMember} className="mt-6 space-y-4">
              <div>
                <label htmlFor="member-name" className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="member-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="member-email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="member-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="member-role" className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="member-role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as TeamMember["role"])
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Team Member">Team Member</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                  setIsFormOpen(false);
                  setEditingMemberId(null);
                  setName("");
                  setEmail("");
                  setRole("Team Member");
                }}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingMemberId ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;